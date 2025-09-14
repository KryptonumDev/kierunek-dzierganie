## Multi-coupon support: end-to-end plan (Supabase + Next.js)

Updated: 2025-09-14

### Goal

Enable applying multiple coupon codes in a single order, with clear stacking rules, correct per-unit calculations for FIXED PRODUCT coupons, robust validation, and full backward compatibility.

## Rules and scope (v1)

- **FIXED PRODUCT coupons**: Multiple allowed if they target disjoint products. Discount applies per eligible unit (quantity), not per line.
- **CART-WIDE coupons (PERCENTAGE, FIXED CART)**: At most one, not combinable with other coupons in v1.
- **VOUCHER**: At most one per order. Applied last, after other discounts. Amount consumed = min(voucher_amount_left, remaining total).
- **AFFILIATE**: Keep current rules (only courses, cannot use own, new users only if enforced). Not combinable with other coupons in v1.
- **Overlapping product targeting** (two coupon codes that both target the same product id): reject the second code in v1.

Notes:

- v2 could allow CART-WIDE + product coupons by excluding already-discounted lines from the cart-wide base, but v1 keeps logic simple and predictable.

## Database (Supabase)

- **orders.used_discounts jsonb null** (new): Array of normalized coupons applied to the order. Keep legacy `orders.used_discount` for backward compatibility when reading historical orders.

```sql
-- Migration: add multi-coupon support on orders
alter table public.orders
  add column if not exists used_discounts jsonb;

-- Optional: document stacking policy for future versions
-- alter table public.coupons add column if not exists stacking_policy text;
```

- No RLS changes required if existing insert/update policies allow writing `used_discount`; verify the same applies to `used_discounts`.
- Keep `coupons_uses` as-is. On completion, insert one row per used coupon (loop through `used_discounts`).

## API changes

### Verify endpoint: `next/src/app/api/coupon/verify/route.ts`

- Extend request to accept either `code: string` (legacy) or `codes: string[]` (new). Always include the cart for eligibility checks.
- For `codes`:
  - Resolve each code using existing logic (state, expiration, limits, affiliation constraints).
  - Compute `eligibleCount` as the sum of quantities for product-targeted coupons.
  - Enforce v1 rules:
    - Max one VOUCHER; max one CART-WIDE; AFFILIATE not combinable with others.
    - For FIXED PRODUCT, ensure no overlapping `discounted_product(s)` across coupons.
  - Return a normalized array of coupons with computed `eligibleCount` and any server-side modifications (e.g., affiliate amount override).
- For `code` (legacy), keep current behavior and response shape.

Response (multi):

```json
{
  "coupons": [
    {
      "id": "...",
      "code": "...",
      "type": "FIXED PRODUCT",
      "amount": 2000,
      "discounted_product": { "id": "...", "name": "..." },
      "discounted_products": [{ "id": "...", "name": "..." }],
      "eligibleCount": 2,
      "affiliation_of": null
    }
  ]
}
```

Implementation notes:

- Reuse the updated selection logic (already fixed for duplicates) when resolving each code.
- Validation should return explicit, user-facing error messages on conflicts.

### Payment create: `next/src/app/api/payment/create/route.ts`

- Accept `input.discounts?: Discount[]` (array). Keep reading `input.discount` for backward compatibility; map it to a single-element array internally.
- Compute final per-coupon contributions:
  - FIXED PRODUCT: `eligibleUnits * amount`, capped by the subtotal of eligible lines.
  - CART-WIDE: Disallowed with others in v1 (reject if combined).
  - VOUCHER: Apply last, cap by remaining total; record the amount used for decrementing `voucher_amount_left`.
- Persist the array to `orders.used_discounts`; keep writing `used_discount` only when a single discount is provided (legacy path), otherwise write `null` there and rely on `used_discounts`.

Completion hooks: `next/src/app/api/payment/complete/check-used-modifications.ts`

- Update to iterate `used_discounts` if present:
  - For vouchers, decrement `coupons.voucher_amount_left` by the used amount for that voucher.
  - Insert into `coupons_uses` one record per coupon. Preserve existing affiliate wallet logic per applicable coupon.
- Keep legacy branch for `used_discount` to support historical orders.

## Frontend changes

### Types: `next/src/global/types.ts`

- Extend order and cart types to support multiple discounts:
  - Add `discounts?: Discount[] | null` to order and checkout payload.
  - Keep `discount?: Discount | null` for legacy orders and UI paths.

### Cart UI: `next/src/components/_global/Header/_Cart.tsx`

- Replace single `usedDiscount` with `usedDiscounts: Discount[]`.
- Promo code UI:
  - One input + “Dodaj” button that appends a verified coupon to the list.
  - Show the list of applied codes with remove actions.
  - On add, call verify with `codes=[...existing, newCode]` to validate stacking rules on the server.
- Reactive updates:
  - On any cart change, recompute `eligibleCount` for each FIXED PRODUCT coupon from quantities and update `usedDiscounts` accordingly.
  - If a coupon’s `eligibleCount` drops to 0, auto-remove it (or toast and keep disabled; v1 recommendation: auto-remove).
- Totals display:
  - Introduce `calculateTotalDiscountAmount(price, discounts[], delivery)` that sums the per-coupon impacts using the same rules as the server (product coupons first, voucher last). Reuse the existing single-coupon function internally per coupon where possible.

### Checkout submit

- Before submit, re-verify with the full `codes[]` set to catch last-minute conflicts and limits.
- Send `input.discounts` to the payment API (fall back to `input.discount` when only one is present).

## Validation and UX

- Prevent duplicates (same code twice).
- Clear messages for conflicts:
  - "Nie można łączyć kodów na te same produkty."
  - "W koszyku można użyć tylko jednego vouchera."
  - "Nie można łączyć tego kodu z innymi zniżkami."
- When a product is removed or quantity decreases, update totals instantly; remove inapplicable coupons automatically.

## Backward compatibility

- Verify endpoint continues to support `code` and returns a single coupon.
- Payment create supports both `discount` and `discounts`; map single discount to array internally.
- Historical orders continue to display based on `used_discount` if `used_discounts` is null.

## Testing matrix

- Two FIXED PRODUCT codes targeting disjoint products; quantities scale per unit; both apply.
- Two FIXED PRODUCT codes overlapping a product; second rejected (UI and API).
- Voucher + product coupon: allowed in v1; voucher applied last and capped.
- Two vouchers: rejected.
- CART-WIDE + any other coupon: rejected in v1.
- Per-user and total use limits: enforced per coupon.
- Affiliate constraints: enforced and not combinable.
- Regression: legacy single-coupon flows still work.

## Rollout plan

1. DB migration: add `orders.used_discounts`.
2. API:
   - Extend verify to accept `codes[]` (feature-flag guard optional).
   - Update payment create to accept arrays and compute per-coupon totals.
   - Update completion hook to loop `used_discounts`.
3. Frontend:
   - Types + cart UI changes (multi-code input, list management, reactive `eligibleCount`).
   - Totals computation and checkout payload changes.
4. QA using the testing matrix.
5. Gradual enablement (keep accepting single code throughout; hide multi-code UI behind a flag if needed).

## Implementation checklist

- [ ] Migration applied in Supabase.
- [ ] Verify route: `codes[]` path implemented + conflict validation.
- [ ] Payment create: array support + per-coupon calculation + `used_discounts` persisted.
- [ ] Completion: loop coupons, voucher decrement per voucher, coupons_uses per coupon.
- [ ] Frontend: multi-code UI + reactive recalculation + totals.
- [ ] Backward compatibility tests pass.

## Analytics & logging (optional but recommended)

- Log selected coupons and computed `eligibleCount` in verify (server-side only).
- Log final applied per-coupon amounts in payment create (server-side only).
- Track client events: code add/remove, validation errors (without PII).

## Edge cases

- Empty cart or zero quantities: disallow applying codes; auto-clear when cart becomes empty.
- All eligible lines discounted to zero before voucher: voucher consumes only what remains.
- Product id changes (e.g., variants): ensure eligibility checks use the correct `product` id consistently across UI and API.

---

If you approve, we’ll implement in this order: DB migration → API (verify, payment, completion) → Frontend (UI + totals) with feature flag capability for the UI.
