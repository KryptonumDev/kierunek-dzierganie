# Payment Webhook Timeout Issue - Analysis & Implementation Plan

## Problem Overview

**Issue Discovered**: November 2024

**Symptom**: Orders intermittently remain stuck in "awaiting payment" (status 1) even after customers successfully complete payment through Przelewy24 (P24). The `paid_at` and `payment_data` fields in Supabase remain empty.

**Evidence**: Client contacted Przelewy24 and received confirmation that between November 10-16, there were **22 timeout events** when P24 attempted to communicate with our server.

**Impact**: Customers pay money, but orders don't get fulfilled. Manual intervention required to fix each stuck order.

---

## Root Cause Analysis

### The Payment Flow

```
1. Customer initiates payment
2. Customer pays at P24 payment page
3. P24 processes payment (money is charged)
4. P24 sends webhook to our server (urlStatus endpoint)
5. Our server processes webhook:
   a. Parse notification
   b. Verify signature
   c. Call P24 API to verify transaction ← PROBLEM HERE
   d. Update order in database
   e. Process invoices, emails, analytics
6. Return 200 to P24
```

### The Timeout Problem

P24 webhooks have a timeout of approximately **15-30 seconds**. If our server doesn't respond with HTTP 200 within that time, P24 considers it a timeout.

**Current Webhook Handler Does Too Much:**

| Operation | Type | Est. Time |
|-----------|------|-----------|
| `parseWebhookBody()` | Local | ~0.1s |
| `p24.verifyNotification()` | Local (hash) | ~0.1s |
| `supabase.select()` | DB call | ~0.3s |
| `verifyTransaction()` | **P24 API call** | **2-15s** ⚠️ |
| `updateOrder()` | DB call | ~0.3s |
| `checkUsedModifications()` | DB calls | ~0.5s |
| `updateItemsQuantity()` | DB calls | ~1s |
| `generateBill()` | PDF + iFirma API | ~5-10s |
| `sendEmails()` | Resend API | ~3-5s |
| `GAConversionPurchase()` | Google API | ~1-2s |
| `MetaConversionPurchase()` | Meta API | ~1-2s |
| **Total** | | **15-35s** ❌ |

### The Critical Insight: Circular Dependency

The `verifyTransaction()` function calls P24's API to confirm we accept the payment. This creates a circular dependency:

```
┌─────────────────────────────────────────────────────────┐
│   P24 Server                    Your Server             │
│                                                         │
│   1. Sends webhook ─────────────────────► Receives      │
│      ⏱️ Waiting for 200...                webhook       │
│                                                         │
│   2. Our server calls        ◄────────── verifyTransaction()
│      P24's verify API                                   │
│      (might be slow)                                    │
│                                                         │
│   ❌ TIMEOUT!                                           │
│   P24 gave up waiting                                   │
│   before we finished                                    │
└─────────────────────────────────────────────────────────┘
```

**Why `paid_at` stays empty**: The timeout happens BEFORE `updateOrder()` is called because `verifyTransaction()` (which comes first) takes too long.

---

## What is `verifyTransaction()` Actually For?

**It's NOT about checking if payment is valid.** P24 already knows the payment happened.

**It's YOUR acknowledgment to P24**: "Yes, I received the notification, I confirm the amount, please transfer the funds to my merchant account."

According to P24 documentation:
> "If you don't verify the transaction, the funds will not be transferred into your account."

**However**, the timing might be flexible. P24 likely doesn't care if verification happens 1 second or 60 seconds after the webhook, as long as it happens eventually.

---

## Solution: Async Verification Pattern

### Core Idea

1. **SYNC (Fast)**: Parse webhook, verify signature, update order → Return 200
2. **ASYNC (Background)**: Verify with P24, generate invoice, send emails, analytics

This ensures P24 gets a response in < 2 seconds, while all heavy processing happens afterward.

---

## Implementation Plan

### Phase 1: Database Migration

**Add new fields to `orders` table:**

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `verification_status` | text | `'pending'` | Track P24 verification state |
| `verification_attempted_at` | timestamp | null | When we last tried to verify |
| `verification_error` | text | null | Error message if verification failed |
| `post_processing_completed` | boolean | false | Track if emails/invoice sent |
| `post_processing_error` | text | null | Error from post-processing |

**`verification_status` enum values:**
- `pending` - Not yet verified with P24
- `verified` - Successfully verified
- `failed` - Verification failed (needs manual review)
- `skipped` - Order was free (no verification needed)

**SQL Migration:**

```sql
-- Add verification tracking fields
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS verification_attempted_at timestamptz,
ADD COLUMN IF NOT EXISTS verification_error text,
ADD COLUMN IF NOT EXISTS post_processing_completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS post_processing_error text;

-- Add index for finding pending verifications
CREATE INDEX IF NOT EXISTS idx_orders_verification_pending 
ON orders (verification_status, paid_at) 
WHERE verification_status IN ('pending', 'failed');
```

---

### Phase 2: Split Webhook Handler

**NEW Flow:**

```
SYNC PHASE (Target: < 2 seconds)
═══════════════════════════════════════════════════════════
1. Parse webhook body (JSON or form-urlencoded)
2. Verify notification signature (local hash, fast)
3. Fetch order from database
4. Check idempotency (already processed? → return 200)
5. Update order:
   - paid_at = now
   - payment_data = notification data
   - status = 2 (in progress)
   - verification_status = 'pending'
6. checkUsedModifications() - mark coupons as used
7. ✅ RETURN 200 TO P24

ASYNC PHASE (Runs via waitUntil after response)
═══════════════════════════════════════════════════════════
8. verifyTransaction() with P24 (8s timeout)
9. Update verification_status = 'verified' or 'failed'
10. updateItemsQuantity()
11. generateBill()
12. sendEmails()
13. GA/Meta analytics
14. Update post_processing_completed = true
```

---

### Phase 3: File Changes

#### Files to Modify:

| File | Changes |
|------|---------|
| `route.ts` | Split into sync/async, use Vercel `waitUntil()` |
| `verify-transaction.ts` | Add 8-second timeout |

#### New Files to Create:

| File | Purpose |
|------|---------|
| `process-async.ts` | Contains all async operations |
| `/api/payment/process-pending/route.ts` | Manual/cron retry endpoint |

---

### Phase 4: Sync Phase Implementation

**`route.ts` - Fast Response Path:**

```typescript
// SYNC PHASE - Must complete in < 2 seconds
export async function POST(request: Request) {
  // 1. Parse webhook
  const notificationData = await parseWebhookBody(request);
  if (!notificationData) return error(400);

  // 2. Verify signature (local, fast)
  const isValid = p24.verifyNotification(notificationData);
  if (!isValid) return error(400);

  // 3. Fetch order
  const { data: order } = await supabase.from('orders').select('*').eq('id', id);
  if (!order) return error(404);

  // 4. Idempotency check
  if (order.paid_at || order.status !== 1) return ok(200);

  // 5. Update order as PAID (optimistic)
  await supabase.from('orders').update({
    paid_at: new Date(),
    payment_data: notificationData,
    status: 2,
    verification_status: 'pending', // Will verify async
  }).eq('id', id);

  // 6. Mark coupons as used (must be sync to prevent race)
  await checkUsedModifications(order);

  // 7. Return 200 immediately
  // 8. Trigger async processing
  waitUntil(processAsync(id, notificationData));

  return NextResponse.json({}, { status: 200 });
}
```

---

### Phase 5: Async Phase Implementation

**`process-async.ts`:**

```typescript
export async function processAsync(orderId: string, notificationData: NotificationRequest) {
  const supabase = createClient();
  
  // Fetch full order data
  const { data: order } = await supabase.from('orders').select('*').eq('id', orderId);

  // 1. VERIFY WITH P24 (with timeout)
  try {
    await verifyTransactionWithTimeout(
      order.amount,
      notificationData.currency,
      notificationData.orderId,
      notificationData.sessionId,
      8000 // 8 second timeout
    );
    
    await supabase.from('orders').update({
      verification_status: 'verified',
      verification_attempted_at: new Date(),
    }).eq('id', orderId);
    
  } catch (error) {
    await supabase.from('orders').update({
      verification_status: 'failed',
      verification_error: error.message,
      verification_attempted_at: new Date(),
    }).eq('id', orderId);
    
    // Alert - verification failed
    await sendPaymentErrorNotification({
      orderId,
      errorType: 'VERIFICATION_ERROR',
      errorMessage: error.message,
      // ...
    });
    
    // Continue with other processing anyway
    // Customer paid, we should still send confirmation
  }

  // 2. Update stock
  await updateItemsQuantity(order);

  // 3. Generate invoice
  try {
    await generateBill(order, orderId);
  } catch (error) {
    console.error('Invoice generation failed', error);
    // Don't block - invoice can be generated later
  }

  // 4. Send emails
  try {
    await sendEmails(order);
  } catch (error) {
    console.error('Email sending failed', error);
  }

  // 5. Analytics
  await GAConversionPurchase({ /* ... */ });
  await MetaConversionPurchase({ /* ... */ });

  // 6. Mark complete
  await supabase.from('orders').update({
    post_processing_completed: true,
  }).eq('id', orderId);
}
```

---

### Phase 6: Recovery Mechanism

**`/api/payment/process-pending/route.ts`:**

For orders where async processing failed or didn't complete.

```typescript
export async function POST(request: Request) {
  const supabase = createClient();
  
  // Find orders needing attention
  const { data: pendingOrders } = await supabase
    .from('orders')
    .select('*')
    .in('verification_status', ['pending', 'failed'])
    .not('paid_at', 'is', null)
    .lt('paid_at', new Date(Date.now() - 60 * 60 * 1000)); // > 1 hour old

  const results = [];
  
  for (const order of pendingOrders) {
    try {
      // Re-attempt verification
      await verifyTransactionWithTimeout(/* ... */);
      
      await supabase.from('orders').update({
        verification_status: 'verified',
        verification_attempted_at: new Date(),
      }).eq('id', order.id);
      
      results.push({ id: order.id, status: 'verified' });
    } catch (error) {
      results.push({ id: order.id, status: 'failed', error: error.message });
    }
  }

  return NextResponse.json({ processed: results });
}
```

**Trigger Options:**
- Manual call from admin panel
- Vercel Cron (every 15 minutes)
- External monitoring service

---

### Phase 7: Add Timeout to verifyTransaction

**`verify-transaction.ts`:**

```typescript
export async function verifyTransactionWithTimeout(
  amount: number,
  currency: string,
  orderId: number,
  sessionId: string,
  timeoutMs: number = 8000
) {
  const p24 = new P24(/* ... */);

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('P24 verification timeout')), timeoutMs);
  });

  const verifyPromise = p24.verifyTransaction({
    amount,
    currency,
    orderId,
    sessionId,
  });

  await Promise.race([verifyPromise, timeoutPromise]);
}
```

---

## Monitoring & Alerts

### Error Scenarios & Actions:

| Scenario | Alert | Action |
|----------|-------|--------|
| Webhook parse fails | Email immediately | Check P24 webhook format |
| Signature invalid | Log only | Might be spam/attack |
| Order update fails | Email immediately | Critical - investigate |
| Verification times out | Email + mark pending | Retry later |
| Verification fails | Email + mark failed | Manual review needed |
| Invoice fails | Log | Can retry manually |
| Email sending fails | Log | Can retry manually |

### Monitoring Queries:

```sql
-- Orders needing manual attention
SELECT id, paid_at, verification_status, verification_error
FROM orders 
WHERE verification_status IN ('pending', 'failed')
AND paid_at < NOW() - INTERVAL '1 hour'
ORDER BY paid_at DESC;

-- Verification success rate (last 7 days)
SELECT 
  verification_status,
  COUNT(*) as count
FROM orders
WHERE paid_at > NOW() - INTERVAL '7 days'
GROUP BY verification_status;
```

---

## Implementation Order

| Step | Task | Time Est. | Priority |
|------|------|-----------|----------|
| 1 | Database migration (dev first) | 15 min | High |
| 2 | Create `process-async.ts` | 30 min | High |
| 3 | Modify `route.ts` (split sync/async) | 45 min | High |
| 4 | Add timeout to `verify-transaction.ts` | 10 min | High |
| 5 | Create `/api/payment/process-pending` | 30 min | Medium |
| 6 | Update error notifications | 15 min | Medium |
| 7 | Testing in sandbox mode | 1 hour | High |
| 8 | Deploy to production | 15 min | High |
| 9 | Monitor for 1 week | Ongoing | High |

**Total estimated time: ~4 hours**

---

## Rollback Plan

If issues arise after deployment:

1. **Database fields are additive** - won't break existing functionality
2. **Can revert `route.ts`** - restore sync version if needed
3. **Recovery endpoint** - can manually process any stuck orders
4. **All changes are backwards compatible**

---

## Success Metrics

After deployment, verify:

- ✅ P24 webhook response time < 2 seconds (check Vercel logs)
- ✅ Zero timeout errors from P24
- ✅ All orders have `verification_status = 'verified'` within 5 minutes of payment
- ✅ No orders stuck in `pending` verification > 1 hour
- ✅ Customer emails sent within 2 minutes of payment

---

## Code Changes Already Made

### 1. Webhook Body Parsing (Completed)

Added support for both JSON and form-urlencoded webhooks in `route.ts`:

```typescript
async function parseWebhookBody(request: Request): Promise<NotificationRequest | null>
```

### 2. P24 Notification Signature Verification (Completed)

Added `p24.verifyNotification()` call before processing.

### 3. Comprehensive Logging (Completed)

Added emoji-prefixed logs throughout the flow:
- `🔔 P24 Webhook received`
- `📦 P24 Notification data`
- `✅ P24 notification signature verified`
- `🔄 Verifying transaction with P24...`
- `✅ P24 transaction verified successfully`
- `❌` for all error scenarios

### 4. Error Email Notifications (Completed)

Created `send-error-notification.ts` that emails `oliwier@kryptonum.eu` for:
- Parse errors
- Verification errors
- Update errors
- Unknown errors

---

## References

- P24 REST API Documentation: https://developers.przelewy24.pl/
- P24 Node.js Library: `@ingameltd/node-przelewy24` v2.1.0
- Vercel `waitUntil()`: https://vercel.com/docs/functions/functions-api-reference#waituntil

---

## Current Implementation Status

### ✅ Phase 1: Immediate Visibility (COMPLETED)

Instead of implementing the full async pattern immediately, we started with **visibility first**:

1. **Error Email Notifications** - `oliwier@kryptonum.eu` receives email when:
   - Webhook parsing fails
   - P24 verification times out
   - P24 verification fails
   - Order update fails
   - Any other unexpected error

2. **8-Second Timeout on P24 Verification** - If P24's API doesn't respond in 8 seconds:
   - We fail fast (don't wait forever)
   - Email notification is sent
   - Client knows immediately there's a problem
   - Can manually intervene

3. **Comprehensive Logging** - All steps are logged with timing:
   - `⏱️ Starting P24 verification with timeout`
   - `⏱️ P24 verification completed in Xms`
   - `⏱️ P24 verification failed after Xms`

### 🔮 Phase 2: Async Pattern (IF NEEDED)

If email notifications show frequent timeouts, we'll implement the full async verification pattern described above. But first, let's gather data on how often this actually happens.

---

## Changelog

| Date | Change |
|------|--------|
| 2024-11-25 | Initial analysis and documentation |
| 2024-11-25 | Added webhook parsing for both JSON and form-urlencoded |
| 2024-11-25 | Added P24 notification signature verification |
| 2024-11-25 | Added comprehensive logging |
| 2024-11-25 | Added error email notifications to oliwier@kryptonum.eu |
| 2024-11-25 | Added 8-second timeout to verifyTransaction() |
| TBD | Implement async verification pattern (if needed based on data) |

