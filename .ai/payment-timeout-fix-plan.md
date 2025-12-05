# Payment Webhook Timeout Issue - Analysis & Implementation Plan

## Problem Overview

**Issue Discovered**: November 2024

**Symptom**: Orders intermittently remain stuck in "awaiting payment" (status 1) even after customers successfully complete payment through Przelewy24 (P24). The `paid_at` and `payment_data` fields in Supabase remain empty.

**Evidence**: Client contacted Przelewy24 and received confirmation that between November 10-16, there were **22 timeout events** when P24 attempted to communicate with our server.

**Impact**: Customers pay money, but orders don't get fulfilled. Manual intervention required to fix each stuck order.

---

## Root Cause Analysis

### The Payment Flow (Before Fix)

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

**Old Webhook Handler Did Too Much Synchronously:**

| Operation                  | Type             | Est. Time     |
| -------------------------- | ---------------- | ------------- |
| `parseWebhookBody()`       | Local            | ~0.1s         |
| `p24.verifyNotification()` | Local (hash)     | ~0.1s         |
| `supabase.select()`        | DB call          | ~0.3s         |
| `verifyTransaction()`      | **P24 API call** | **2-15s** ⚠️  |
| `updateOrder()`            | DB call          | ~0.3s         |
| `checkUsedModifications()` | DB calls         | ~0.5s         |
| `updateItemsQuantity()`    | DB calls         | ~1s           |
| `generateBill()`           | PDF + iFirma API | ~5-10s        |
| `sendEmails()`             | Resend API       | ~3-5s         |
| `GAConversionPurchase()`   | Google API       | ~1-2s         |
| `MetaConversionPurchase()` | Meta API         | ~1-2s         |
| **Total**                  |                  | **15-35s** ❌ |

---

## Solution Implemented: Vercel `waitUntil()` Pattern

### The Fix

Split the webhook handler into two phases:

1. **SYNC Phase** (< 1 second): Critical operations, return 200 immediately
2. **ASYNC Phase** (up to 60 seconds): Heavy processing runs in background via `waitUntil()`

### New Payment Flow

```
SYNC PHASE (Target: < 1 second)
═══════════════════════════════════════════════════════════
1. Parse webhook body (JSON or form-urlencoded)
2. Verify notification signature (local hash, fast)
3. Fetch order from database
4. Check idempotency (already processed? → return 200)
5. Update order:
   - paid_at = now
   - payment_data = notification data
   - status = 2 (in progress)
6. checkUsedModifications() - mark coupons as used
7. ✅ RETURN 200 TO P24

ASYNC PHASE (Runs via waitUntil after response)
═══════════════════════════════════════════════════════════
8. verifyTransaction() with P24 (10s timeout)
9. updateItemsQuantity()
10. generateBill()
11. sendEmails()
12. GA/Meta analytics
13. If ANY critical step fails → send error notification email
```

---

## Implementation Status: ✅ COMPLETED

### Files Changed

| File                         | Changes                                                |
| ---------------------------- | ------------------------------------------------------ |
| `route.ts`                   | Split into sync/async using `waitUntil()`, timing logs |
| `send-error-notification.ts` | Fixed email recipients bug, removed sandbox check      |
| `verify-transaction.ts`      | Hardcoded `sandbox: false`                             |

### New Files Created

| File                    | Purpose                                  |
| ----------------------- | ---------------------------------------- |
| `process-background.ts` | Contains all async/background operations |

### Bugs Fixed

| Bug                                                 | Fix                                         |
| --------------------------------------------------- | ------------------------------------------- |
| Malformed email recipients `['a@b.com, c@d.com']`   | Changed to `['a@b.com', 'c@d.com']`         |
| Missing error notification in outer catch block     | Added `sendPaymentErrorNotification()` call |
| SANDBOX check blocking emails                       | Removed the check entirely                  |
| `'use server'` directive (incorrect for API routes) | Removed                                     |
| Signature verification "continue anyway"            | Made it fail properly                       |

### Dependencies Added

```
@vercel/functions@3.3.4
```

---

## Console Logs (Minimal)

Only two timing logs per successful request:

```
⏱️ [SYNC] Order abc123 completed in 487ms
⏱️ [BACKGROUND] Order abc123 completed in 8543ms
```

Error logs are kept for debugging:

- `❌ Failed to parse webhook body`
- `❌ P24 notification signature verification failed`
- `❌ Failed to fetch order from DB`
- `❌ Failed to update order`
- `❌ [BACKGROUND] P24 verification failed`
- `❌ [BACKGROUND] Stock update failed`
- `❌ [BACKGROUND] Invoice generation failed`
- `❌ [BACKGROUND] Failed to send emails`
- `❌ [BACKGROUND] GA/Meta tracking failed`

---

## Error Notifications

Error emails are sent to `oliwier@kryptonum.eu` and `kontakt@kierunekdzierganie.pl` for:

| Error Type           | When                                     |
| -------------------- | ---------------------------------------- |
| `PARSE_ERROR`        | Webhook body can't be parsed             |
| `VERIFICATION_ERROR` | P24 transaction verification fails       |
| `UPDATE_ERROR`       | Database update fails                    |
| `PROCESSING_ERROR`   | Stock update or invoice generation fails |
| `UNKNOWN_ERROR`      | Any unexpected error in outer catch      |

---

## Testing Strategy

### Test with Real 0.01 PLN Transaction

1. **Prepare test product** - Use a product with coupon/discount so total = 0.01 PLN (1 grosz)
2. **Deploy the fix** to production
3. **Make test purchase** through full checkout flow
4. **Verify results**

### Verification Checklist

| Check             | How to Verify                  | Expected             |
| ----------------- | ------------------------------ | -------------------- |
| P24 gets 200 fast | Vercel logs: `⏱️ [SYNC]`       | < 1 second           |
| P24 no timeout    | Check P24 merchant panel       | No timeout errors    |
| Order marked paid | Supabase: check `paid_at`      | Set immediately      |
| Background works  | Vercel logs: `⏱️ [BACKGROUND]` | Completes within 60s |
| Invoice generated | Check iFirma or storage        | PDF exists           |
| Email received    | Check inbox                    | Confirmation arrives |
| Error emails work | Temporarily break code, verify | Error email received |

### SQL to Check Order Status

```sql
SELECT id, paid_at, status, payment_data
FROM orders
WHERE id = 'your-test-order-id';
```

---

## What If Background Processing Fails?

Since customer already paid and `paid_at` is set in sync phase, the order is "safe":

| Failure                | Impact                                     | Recovery                     |
| ---------------------- | ------------------------------------------ | ---------------------------- |
| P24 verification fails | Funds may not transfer to merchant account | Manual verification or retry |
| Stock update fails     | Quantities not decremented                 | Manual update                |
| Invoice fails          | No PDF generated                           | Generate manually later      |
| Emails fail            | Customer doesn't get confirmation          | Resend manually              |
| Analytics fail         | Lost conversion tracking                   | Not critical                 |

All critical failures trigger error notification email for manual intervention.

---

## Rollback Plan

If issues arise after deployment:

1. **Database is unchanged** - no migration needed for this fix
2. **Can revert to previous version** - git revert the changes
3. **Error emails** - will alert immediately if something breaks
4. **All changes are backwards compatible**

---

## Success Metrics

After deployment, verify:

- ✅ P24 webhook response time < 1 second (check `⏱️ [SYNC]` timing in Vercel logs)
- ✅ Zero timeout errors from P24 (check P24 merchant panel)
- ✅ All orders have `paid_at` set immediately after payment
- ✅ Customer emails sent within 2 minutes of payment
- ✅ Error notification emails arrive when something fails

---

## References

- P24 REST API Documentation: https://developers.przelewy24.pl/
- P24 Node.js Library: `@ingameltd/node-przelewy24` v2.1.0
- Vercel `waitUntil()`: https://vercel.com/docs/functions/functions-api-reference#waituntil

---

## Changelog

| Date       | Change                                                                           |
| ---------- | -------------------------------------------------------------------------------- |
| 2024-11-25 | Initial analysis and documentation                                               |
| 2024-11-25 | Added webhook parsing for both JSON and form-urlencoded                          |
| 2024-11-25 | Added P24 notification signature verification                                    |
| 2024-11-25 | Added comprehensive logging                                                      |
| 2024-11-25 | Added error email notifications (with bugs)                                      |
| 2024-11-25 | Added 10-second timeout to verifyTransaction()                                   |
| 2024-12-05 | Discovered email notification bugs (malformed recipients, missing catch handler) |
| 2024-12-05 | Decision: Implement `waitUntil()` pattern                                        |
| 2024-12-05 | Installed `@vercel/functions` package                                            |
| 2024-12-05 | Created `process-background.ts` for async operations                             |
| 2024-12-05 | Refactored `route.ts` to use sync/async pattern with `waitUntil()`               |
| 2024-12-05 | Fixed email recipients bug in `send-error-notification.ts`                       |
| 2024-12-05 | Removed SANDBOX checks (testing with real 0.01 PLN payments)                     |
| 2024-12-05 | Added error notifications for stock/invoice failures                             |
| 2024-12-05 | Added timing logs (`⏱️ [SYNC]` and `⏱️ [BACKGROUND]`)                            |
| 2024-12-05 | Added error notification to outer catch block                                    |
| 2024-12-05 | **Implementation complete - ready for testing**                                  |
