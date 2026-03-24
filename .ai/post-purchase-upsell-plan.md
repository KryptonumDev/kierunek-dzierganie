# Post-Purchase Upsell — Implementation Plan

## Background

**Request from client (Magdalena):**
After purchasing a specific course (e.g. "Program"), instead of redirecting to the plain order dashboard, show a dedicated thank-you page that also presents a time-limited discount offer for other courses or course packages.

---

## Problem Statement

The current post-purchase flow has no upsell mechanism for the main store checkout:

- **Logged-in users** are redirected to `/moje-konto/zakupy/{orderId}` — a functional order record page with no offer, no emotional reinforcement, no cross-sell.
- **Guest users** are redirected to `/dziekujemy-za-zamowienie` — a fully static CMS page with no order context and no offer.
- The **only existing upsell infrastructure** lives exclusively in the landing page flow (`/landing/[slug]/[thankYouSlug]`) and is completely disconnected from the main store checkout.

---

## Scope & Design Decisions

| Concern | Decision |
|---|---|
| Who gets the upsell? | Logged-in users only (guests cannot buy courses — blocked by checkout) |
| What can be upselled? | Courses and bundles (v1) |
| Trigger | Configured per product/course in Sanity CMS (`postPurchaseOffer` object field) |
| No offer configured? | Redirect unchanged — `/moje-konto/zakupy/{orderId}` as before |
| Offer configured? | Redirect to new `/dziekujemy/[orderId]` page |
| Page design | Combined: thank-you confirmation + offer in the same section (not sequential — avoids the "scroll to see the offer" problem) |
| Timer | Configurable in minutes per product in Sanity. Expiration = `paid_at + discountTimeMinutes`, stored in Supabase |
| Coupon format | 12-char mixed alphanumeric via existing `generateRandomCode()` — same format as vouchers and affiliate codes |
| Coupon security | UUID-entropy code + `use_limit: 1` + `expiration_date` + `discounted_products` scoping. No `user_id` enforcement needed (same model as all other coupons in the system) |
| Coupon lookup (idempotency) | `course_discount_data->order_id` — reuses existing JSON column, no DB migration needed |
| Expired offer | Graceful degradation: show thank-you message, display "offer expired" state (same pattern as landing page) |
| Buttons | Primary: "Kup kurs za [discounted price]" (cart pre-applied with code). Secondary: "Przejdź do zamówienia" → `/moje-konto/zakupy/{orderId}` |
| Guest users | No change — old redirect behavior unchanged |

---

## Current Purchase Flow (for reference)

```
Checkout drawer
  └─ POST /api/payment/create
       ├─ Order inserted into Supabase (status: 1)
       ├─ P24 transaction created
       └─ Browser redirected to Przelewy24

Przelewy24 payment page
  └─ User pays

GET /api/payment/verify?session=&id=
  ├─ Checks P24 transaction status
  └─ Redirects:
       ├─ guest      → /dziekujemy-za-zamowienie   ← unchanged
       └─ logged-in  → /moje-konto/zakupy/{id}     ← CHANGED conditionally

POST /api/payment/complete (P24 webhook, runs in parallel)
  ├─ [sync]  mark order paid, record coupon usage
  └─ [background] grant course access, invoice, emails, analytics
```

---

## Implementation Plan

### Phase 1 — Sanity Schema

**Goal:** Give editors the ability to configure a post-purchase offer on any course or bundle document.

#### Step 1.1 — Add `postPurchaseOffer` object to `course` schema

Add a collapsible object field `postPurchaseOffer` to `/sanity/schemas/collectionTypes/course.js` containing:

- `enabled` (boolean) — toggle to activate/deactivate the offer
- `offeredItems` (array of references) — courses and/or bundles to offer
- `discountAmount` (number) — discount value in grosze (same unit as existing `discountTime` field in `thankYouPage`)
- `discountTimeMinutes` (number) — countdown duration in minutes
- `headline` (string) — offer headline shown on the page
- `subheadline` (text) — supporting copy

Validation: `discountAmount` must be less than the offered item's price (mirror the existing validation in `thankYouPage.js`).

#### Step 1.2 — Add `postPurchaseOffer` to `bundle` schema

Same fields as Step 1.1, applied to `/sanity/schemas/collectionTypes/bundle.js`.

---

### Phase 2 — API Route: Post-Purchase Offer

**Goal:** Server-side endpoint that, given an `orderId`, determines whether an offer should be shown and returns (or creates) the personalized coupon.

#### Step 2.1 — Create `/api/post-purchase-offer/[orderId]/route.ts`

Logic:

1. Authenticate the request — confirm the calling user owns this order (compare `user_id` from Supabase session with `orders.user_id`).
2. Fetch the order from Supabase — get `products`, `paid_at`, `user_id`.
3. For each product in the order, fetch from Sanity to check if `postPurchaseOffer.enabled === true`.
4. Take the first matching offer found (if multiple products in cart have offers, first one wins — can be extended later).
5. Check `course_discount_data` in the `coupons` table for an existing coupon linked to this `order_id` (idempotency check).
6. If no existing coupon: generate one using `generateRandomCode()`, insert into `coupons` with:
   - `code`: generated code
   - `type`: PERCENTAGE or FIXED PRODUCT (depending on offer config)
   - `amount`: `discountAmount`
   - `use_limit`: 1
   - `expiration_date`: `paid_at + discountTimeMinutes`
   - `discounted_products`: array of offered item IDs
   - `state`: 2 (active)
   - `course_discount_data`: `{ order_id: orderId, user_id: userId }`
7. Return: offer data (headline, subheadline, offered products with prices, coupon code, expiration timestamp) or `{ offer: null }` if no offer applies.

---

### Phase 3 — New Thank-You Page

**Goal:** A dedicated post-purchase page that combines order confirmation with the upsell offer.

#### Step 3.1 — Create `/app/(main)/dziekujemy/[orderId]/page.tsx`

Server component that:

1. Reads `orderId` from params.
2. Fetches the order from Supabase (validate it belongs to the current session user — return 404 otherwise).
3. Calls the logic from Phase 2 (inline or via the API route) to get offer data.
4. Renders the combined layout.

SEO: `noindex, nofollow` (same as the guest thank-you page).

#### Step 3.2 — Combined Hero Component: `PostPurchaseHero`

A new component at `/components/_postPurchase/PostPurchaseHero/PostPurchaseHero.tsx`:

Layout (single section, visible above the fold):
- **Left / top half:** Order confirmed message, order number, email confirmation notice, "Przejdź do zamówienia" secondary button
- **Right / bottom half:** Offer headline, offered product(s) with original price crossed out + discounted price, countdown timer (reuse `TimerBox` logic), primary CTA button "Kup kurs za [price]"

When offer is expired: right side shows "Oferta wygasła" state instead of timer + CTA.
When `offer === null`: component is not rendered (page redirects back to old order page instead).

#### Step 3.3 — Countdown timer behavior

Reuse the existing `TimerBox` component or its underlying logic. Timer is initialized from `expirationDate` returned by the API (server-stored, not client-computed). Refreshing the page does not reset the timer.

---

### Phase 4 — Update Redirect Logic

**Goal:** Wire the new page into the existing checkout flow.

#### Step 4.1 — Update `GET /api/payment/verify/route.ts`

In `getRedirectUrl()`, after determining the order is not a guest order:

1. Fetch the order's products.
2. Check Sanity for `postPurchaseOffer.enabled` on any of the purchased products.
3. If offer found → redirect to `/dziekujemy/{orderId}`.
4. If no offer → redirect to `/moje-konto/zakupy/{orderId}` (unchanged).

#### Step 4.2 — Update free-order branch in `POST /api/payment/create/route.ts`

The free-order (100% discount) branch has a hardcoded redirect to `/moje-konto/zakupy/{id}` for logged-in users. Apply the same Sanity check and redirect to `/dziekujemy/{orderId}` when an offer is configured.

---

### Phase 5 — QA & Edge Cases

#### Step 5.1 — Edge case handling

- **User visits `/dziekujemy/{orderId}` for someone else's order** → 404
- **User visits `/dziekujemy/{orderId}` after offer expired** → show expired state, not 404
- **User visits `/dziekujemy/{orderId}` multiple times** → idempotent: same coupon returned, timer counts down from original expiry
- **Coupon already used** → show "kod już wykorzystany" state
- **Order not yet paid** (webhook hasn't fired yet, timing race) → show confirmation message, but no offer (offer requires `paid_at` to compute expiry)
- **Multiple products in cart, multiple have offers** → first matching product's offer wins (v1)

#### Step 5.2 — Manual QA checklist

- [ ] Buy a course with `postPurchaseOffer.enabled = true` → land on `/dziekujemy/{orderId}`
- [ ] Buy a course without offer → land on `/moje-konto/zakupy/{orderId}` as before
- [ ] Guest buys physical product → land on `/dziekujemy-za-zamowienie` as before
- [ ] Refresh `/dziekujemy/{orderId}` → timer does not reset
- [ ] Wait for timer to expire → offer expires gracefully
- [ ] Use the generated coupon code in checkout → discount applied correctly
- [ ] Try to use the code a second time → rejected (use_limit: 1)
- [ ] Visit another user's `/dziekujemy/{orderId}` URL → 404

---

---

### Phase 6 — Testing (No P24 Sandbox Required)

**Constraint:** We have no access to the Przelewy24 sandbox. All testing must happen without triggering a real or simulated P24 payment.

**Key insight from the verify route:** `/api/payment/verify` calls the P24 API to check transaction status, but regardless of the result — including a complete failure / bad session / auth error — it always falls through and calls `getRedirectUrl(id)` before redirecting. This means the redirect decision logic (our Phase 4 change) can be tested with a fake session as long as the order ID in Supabase is real.

This gives us three independent testing vectors that together cover the full flow without ever touching P24.

---

#### Step 6.1 — Configure an existing course in Sanity (no new test course needed)

No new test course needs to be created. Use an existing course document.

**How Sanity content visibility works in this project:**

The `sanityFetch` utility has two clients:
- **`publicClient`** — `perspective: 'published'`, CDN-backed. Used on production. Reads only published documents.
- **`authenticatedClient`** — `perspective: 'drafts'`, token-authenticated. Used only on preview deployments (`isPreviewDeployment = true`) or when `noCache: true` / `useAuthClient: true` is passed.

This means: **if you configure `postPurchaseOffer` on an existing course but do not publish the change, the live production site reads only the published version and sees nothing.** Draft changes are invisible to real users.

**Recommended approach — keep as draft, test on a preview deployment:**

1. Open an existing course in Sanity Studio.
2. Fill in the `postPurchaseOffer` fields: enable it, set offered items, discount amount, and a short `discountTimeMinutes` (e.g. `3` minutes — useful for quickly reaching the expired state during testing).
3. **Do not publish** — save as draft only.
4. Push the feature branch to GitHub → Vercel creates a preview deployment.
5. On the preview deployment, `isPreviewDeployment = true` → `authenticatedClient` is used → `perspective: 'drafts'` → the draft `postPurchaseOffer` config is visible.
6. All testing (Steps 6.2–6.6) is done on the preview deployment URL. Real users on the production domain are completely unaffected.
7. When the feature is ready to go live: publish the Sanity document + merge the branch to main in a single coordinated step.

**Alternative — publish the field, test locally:**

If you don't want to use a preview deployment, you can also publish the `postPurchaseOffer` field in Sanity and test locally. This is safe because:
- The production codebase doesn't query that field yet — it is completely inert until the new code is deployed.
- The `/dziekujemy/` route doesn't exist on production yet.
- The verify route on production still redirects to the old URL regardless.

The field sitting published in Sanity has zero effect on real users until the new code goes live.

Leave one other course **without** `postPurchaseOffer` configured — needed to verify that the old redirect path is unchanged.

---

#### Step 6.2 — End-to-end test via free order (best full-flow test)

The free-order branch in `payment/create` runs the entire post-payment processing (course access, emails, redirect) **without P24**. A 100% coupon turns any real purchase into a free order.

Steps:

1. In the Supabase `coupons` table, create a test coupon: `type = PERCENTAGE`, `amount = 100`, `state = 2`, no expiry, `use_limit = null` (reusable for testing).
2. Log in as a test user account.
3. Add the configured test course (from Step 6.1) to the cart.
4. In checkout, apply the 100% coupon code → total becomes 0 zł.
5. Submit the order.
6. **Expected:** browser redirects to `/dziekujemy/{orderId}` (because the product has `postPurchaseOffer` configured).
7. Verify the combined thank-you + offer page renders correctly: confirmation message, offered products, timer counting down, both buttons present.
8. Open the Supabase `coupons` table and verify a new upsell coupon was created with correct `expiration_date`, `discounted_products`, `use_limit: 1`, and `course_discount_data->order_id` matching the order.

Repeat with a course that has **no** `postPurchaseOffer`:

- Expected: browser redirects to `/moje-konto/zakupy/{orderId}` as before (old behavior unchanged).

---

#### Step 6.3 — Test the verify route redirect in isolation

This tests the Phase 4 change to `getRedirectUrl` without needing a real payment.

1. Take any real order ID from Supabase (use the one created in Step 6.2, or manually insert a test order with `is_guest_order: false`, `user_id` set, and products pointing to the configured test course).
2. While logged in, navigate directly in the browser to:
   ```
   https://kierunekdzierganie.pl/api/payment/verify?session=TEST&id={orderId}
   ```
3. The P24 API call will return an error or empty response (fake session), but the route still calls `getRedirectUrl(id)` and redirects.
4. **Expected:** redirected to `/dziekujemy/{orderId}` if the order's products have `postPurchaseOffer`, or to `/moje-konto/zakupy/{orderId}` if not.

This directly validates the redirect branching logic introduced in Phase 4, step by step, without any payment.

---

#### Step 6.4 — Test the API route directly

Verify the coupon generation logic in isolation.

1. With a valid session cookie (logged-in browser), open DevTools → Network, or use a REST client.
2. Make a `GET` request to `/api/post-purchase-offer/{orderId}` for:
   - An order that has an offer-configured product → expect coupon data in the response.
   - The same order a second time → expect the same coupon returned (idempotency).
   - An order with no offer-configured product → expect `{ offer: null }`.
   - An order belonging to a different user → expect `403` or `404`.
3. In Supabase, confirm that hitting the route twice for the same order created exactly **one** coupon row, not two.

---

#### Step 6.5 — Test the page directly at URL

Test all UI states by navigating to the page directly, without going through checkout.

| Test | How | Expected |
|---|---|---|
| Valid order with active offer | Navigate to `/dziekujemy/{orderId}` as order owner | Combined hero renders with timer and CTA |
| Refresh the page | Reload the same URL | Timer continues from stored `expiration_date`, does not reset |
| Expired offer | Set `expiration_date` to a past timestamp in Supabase, reload | "Oferta wygasła" state shown, no CTA, thank-you message still visible |
| Coupon already used | Set `state = 1` on the upsell coupon row in Supabase, reload | "Kod już wykorzystany" state shown |
| Different user | Open incognito, log in as different user, navigate to the URL | 404 |
| Not logged in | Log out, navigate to the URL | Redirect to login page (standard auth guard) |
| No offer on product | Use an order whose products have no `postPurchaseOffer` | Page redirects to `/moje-konto/zakupy/{orderId}` or returns 404 |

---

#### Step 6.6 — Test the upsell coupon in checkout

Verify the generated coupon code actually works as a discount in a subsequent purchase.

1. From the thank-you page (or from Supabase dashboard), copy the generated upsell coupon code.
2. Add the offered course to cart.
3. In checkout, apply the coupon code.
4. **Expected:** discount applied correctly, final price reduced by the configured `discountAmount`.
5. Complete the purchase as a free order (if discount makes it 100%) or stop at the checkout stage — no need to pay.
6. Try to apply the same code again in a new cart → **expected:** rejected with "Osiągnięto limit użyć kodu" (use_limit: 1).

---

#### Step 6.7 — Post-deploy production smoke test

Once deployed to production, perform one real end-to-end test with an actual P24 payment. This is the only test that exercises the full webhook path.

1. Use the lowest-price product available that has `postPurchaseOffer` configured (to minimize the real transaction amount).
2. Complete a real checkout with a real payment.
3. Verify: redirected to `/dziekujemy/{orderId}`, upsell shown, coupon created in Supabase with correct expiry.
4. Verify the P24 webhook also fired correctly: order status updated, course access granted, invoice generated, confirmation email received.

This is the only step that requires a real transaction. Everything prior to this can be validated in the local or staging environment.

---

---

### Phase 7 — Going Live

**Goal:** Deploy all changes to production in one coordinated step so that the Sanity schema, the new code, and the published CMS content all go live together.

#### Step 7.1 — Publish the `postPurchaseOffer` config in Sanity Studio

Open the course document(s) configured for testing in Sanity Studio and click **Publish**. Up until this point the config existed only as a draft and was invisible to the production site. Publishing it now is safe because the new code is about to go live simultaneously.

#### Step 7.2 — Deploy Sanity Studio

Run the deploy command from the `sanity/` directory:

```bash
sanity deploy
```

This pushes the updated schema (the new `postPurchaseOffer` group and fields on `course` and `bundle` documents) to the hosted Sanity Studio so editors can access and configure the fields.

#### Step 7.3 — Merge the feature branch to `main`

Create a pull request from the feature branch and merge to `main`. Vercel will automatically trigger a production deployment.

Confirm the deployment succeeds before proceeding to the smoke test (Phase 6, Step 6.7).

#### Step 7.4 — Post-deploy smoke test

Follow Step 6.7 from Phase 6: perform one real end-to-end purchase of a low-value course with `postPurchaseOffer` configured and verify the full flow including the P24 webhook.

---

## Files To Create

| File | Purpose |
|---|---|
| `sanity/schemas/collectionTypes/Course_Collection.jsx` | Add `postPurchaseOffer` field (edit existing) |
| `sanity/schemas/collectionTypes/Bundle_Collection.jsx` | Add `postPurchaseOffer` field (edit existing) |
| `next/src/app/api/post-purchase-offer/[orderId]/route.ts` | Offer resolution + coupon generation API |
| `next/src/app/(main)/dziekujemy/[orderId]/page.tsx` | New thank-you page |
| `next/src/components/_postPurchase/PostPurchaseHero/PostPurchaseHero.tsx` | Combined thank-you + offer component |

## Files To Edit

| File | Change |
|---|---|
| `next/src/app/api/payment/verify/route.ts` | Add offer check → conditional redirect |
| `next/src/app/api/payment/create/route.ts` | Same for free-order branch |
