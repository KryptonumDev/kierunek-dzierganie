## Category-based Coupon Restrictions: Implementation Plan

Updated: 2025-01-19

### Goal

Enable coupon codes to be restricted to specific product categories (e.g., "only crocheting courses", "only instruction products"). Includes two major changes:
1. Category restrictions filtering for PERCENTAGE, FIXED CART, and VOUCHER coupons
2. Discounts no longer apply to delivery costs (except FREE DELIVERY type)

---

## Background

The admin panel and database have been updated with a new `category_restrictions` JSONB column on the `coupons` table:

```json
{
  "product_types": ["course"] | ["product"] | ["bundle"] | null,
  "course_basis": ["crocheting"] | ["knitting"] | null,
  "product_categories": ["instruction", "materials", "other", "crocheting", "knitting"] | null
}
```

### Field Mapping

| DB Field | DB Value | Maps to Product Property |
|----------|----------|--------------------------|
| `product_types` | `"course"` | `_type === 'course'` |
| `product_types` | `"product"` | `_type === 'product'` |
| `product_types` | `"bundle"` | `_type === 'bundle'` |
| `course_basis` | `"crocheting"` | `basis === 'crocheting'` (courses/bundles) |
| `course_basis` | `"knitting"` | `basis === 'knitting'` (courses/bundles) |
| `product_categories` | `"instruction"` | `basis === 'instruction'` (products) |
| `product_categories` | `"materials"` | `basis === 'materials'` (products) |
| `product_categories` | `"other"` | `basis === 'other'` (products) |
| `product_categories` | `"crocheting"` | `basis === 'crocheting'` (products) |
| `product_categories` | `"knitting"` | `basis === 'knitting'` (products) |

---

## Rules and Scope

### Coupon Type Restrictions

| Coupon Type | Category Restrictions | Applies To | Affects Delivery |
|-------------|----------------------|------------|------------------|
| `PERCENTAGE` | ✓ Yes | Eligible products only | ✗ No |
| `FIXED CART` | ✓ Yes | Eligible products only | ✗ No |
| `VOUCHER` | ✓ Yes | Eligible products only | ✗ No |
| `FIXED PRODUCT` | ✗ No (uses `discounted_products`) | Specific products | ✗ No |
| `DELIVERY` / `FREE DELIVERY` | ✗ No | Delivery only | ✓ Yes |

### Key Behavior Changes

1. **Partial Cart Application**: If a coupon restricts to "crocheting courses" and cart contains both crocheting and knitting courses, the discount applies ONLY to the crocheting courses subtotal.

2. **Delivery Excluded**: All product/cart coupons (PERCENTAGE, FIXED CART, VOUCHER, FIXED PRODUCT) now apply to products only. Delivery is never discounted except by FREE DELIVERY coupons.

3. **Backward Compatibility**: Coupons with `null` category_restrictions behave as before (apply to all products, but still exclude delivery per new rules).

### Calculation Examples

**Example 1: Restricted PERCENTAGE**
- Cart: Crocheting course (200 PLN) + Knitting course (100 PLN) + Delivery (16 PLN)
- Coupon: 20% off, `course_basis: ["crocheting"]`
- Eligible subtotal: 200 PLN
- Discount: 20% × 200 = 40 PLN
- Total: (200 - 40) + 100 + 16 = **276 PLN**

**Example 2: FIXED CART exceeds products**
- Cart: Course (250 PLN) + Delivery (16 PLN)
- Coupon: 400 PLN off (no restrictions)
- Products subtotal: 250 PLN
- Discount: min(400, 250) = 250 PLN
- Total: 0 + 16 = **16 PLN** (delivery still charged)

**Example 3: Restricted VOUCHER**
- Cart: Crocheting course (150 PLN) + Product (100 PLN) + Delivery (20 PLN)
- Voucher: 500 PLN balance, `product_types: ["course"]`
- Eligible subtotal: 150 PLN
- Voucher used: 150 PLN (350 PLN remaining)
- Total: 0 + 100 + 20 = **120 PLN**

---

## Implementation

### Phase 1: Shared Utilities

#### 1.1 Create eligibility helper: `next/src/utils/coupon-eligibility.ts`

```typescript
export type CategoryRestrictions = {
  product_types?: ('course' | 'product' | 'bundle')[] | null;
  course_basis?: ('crocheting' | 'knitting')[] | null;
  product_categories?: ('instruction' | 'materials' | 'other' | 'crocheting' | 'knitting')[] | null;
} | null;

export type CartItemForEligibility = {
  _type: 'course' | 'product' | 'bundle' | 'voucher';
  basis?: string;
  _id?: string;
  product?: string; // cart item product ID
  quantity?: number;
  price?: number;
  discount?: number;
};

/**
 * Check if a cart item is eligible for a coupon based on category restrictions.
 * Returns true if item matches all applicable restrictions.
 * Returns true for null restrictions (backwards compatible - all items eligible).
 */
export function isItemEligibleForCoupon(
  item: CartItemForEligibility,
  restrictions: CategoryRestrictions
): boolean {
  // No restrictions = everything eligible (backward compatible)
  if (!restrictions) return true;
  
  const { product_types, course_basis, product_categories } = restrictions;
  
  // 1. Check product type restriction
  if (product_types && product_types.length > 0) {
    if (!product_types.includes(item._type as 'course' | 'product' | 'bundle')) {
      return false;
    }
  }
  
  // 2. For courses/bundles: check course_basis if set
  if (
    (item._type === 'course' || item._type === 'bundle') &&
    course_basis &&
    course_basis.length > 0
  ) {
    if (!item.basis || !course_basis.includes(item.basis as 'crocheting' | 'knitting')) {
      return false;
    }
  }
  
  // 3. For physical products: check product_categories if set
  if (
    item._type === 'product' &&
    product_categories &&
    product_categories.length > 0
  ) {
    if (!item.basis || !product_categories.includes(item.basis as any)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Calculate the subtotal of eligible items for a coupon.
 */
export function calculateEligibleSubtotal(
  items: CartItemForEligibility[],
  restrictions: CategoryRestrictions
): number {
  return items
    .filter(item => isItemEligibleForCoupon(item, restrictions))
    .reduce((sum, item) => {
      const price = item.discount ?? item.price ?? 0;
      const quantity = item.quantity ?? 1;
      return sum + price * quantity;
    }, 0);
}

/**
 * Get IDs of eligible items for a coupon.
 */
export function getEligibleItemIds(
  items: CartItemForEligibility[],
  restrictions: CategoryRestrictions
): string[] {
  return items
    .filter(item => isItemEligibleForCoupon(item, restrictions))
    .map(item => item._id || item.product || '')
    .filter(Boolean);
}

/**
 * Generate user-friendly restriction description in Polish.
 */
export function getRestrictionDescription(restrictions: CategoryRestrictions): string | null {
  if (!restrictions) return null;
  
  const parts: string[] = [];
  
  if (restrictions.product_types?.length) {
    const typeNames: Record<string, string> = {
      course: 'kursy',
      product: 'produkty',
      bundle: 'pakiety kursów',
    };
    parts.push(restrictions.product_types.map(t => typeNames[t] || t).join(' lub '));
  }
  
  if (restrictions.course_basis?.length) {
    const basisNames: Record<string, string> = {
      crocheting: 'szydełkowanie',
      knitting: 'dzierganie na drutach',
    };
    parts.push(restrictions.course_basis.map(b => basisNames[b] || b).join(' lub '));
  }
  
  if (restrictions.product_categories?.length) {
    const catNames: Record<string, string> = {
      instruction: 'instrukcje',
      materials: 'pakiety materiałów',
      other: 'inne produkty',
      crocheting: 'produkty do szydełkowania',
      knitting: 'produkty do dziergania',
    };
    parts.push(restrictions.product_categories.map(c => catNames[c] || c).join(' lub '));
  }
  
  return parts.length > 0 ? `Dotyczy: ${parts.join(', ')}` : null;
}
```

#### 1.2 Update types: `next/src/global/types.ts`

Add to existing `Discount` type:

```typescript
export type CategoryRestrictions = {
  product_types?: ('course' | 'product' | 'bundle')[] | null;
  course_basis?: ('crocheting' | 'knitting')[] | null;
  product_categories?: ('instruction' | 'materials' | 'other' | 'crocheting' | 'knitting')[] | null;
} | null;

export type Discount = {
  amount: number;
  code: string;
  id: string;
  type: string;
  totalVoucherAmount: number | null;
  discounted_product: { id: string; name: string };
  discounted_products?: Array<{ id: string; name: string }> | any;
  eligibleCount?: number;
  aggregates?: boolean;
  affiliatedBy: string | null;
  // NEW: Category restrictions
  category_restrictions?: CategoryRestrictions;
  // NEW: Eligible subtotal for restricted coupons
  eligibleSubtotal?: number;
  // NEW: IDs of eligible items
  eligibleItemIds?: string[];
};
```

---

### Phase 2: API Updates

#### 2.1 Update coupon verification: `next/src/app/api/coupon/verify/route.ts`

**Changes:**

1. Add `category_restrictions` to SELECT query
2. For non-FIXED-PRODUCT coupons, check if any cart items are eligible
3. Return `category_restrictions`, `eligibleSubtotal`, and `eligibleItemIds` in response
4. Add guard: if FIXED PRODUCT has restrictions, log warning and ignore them

```typescript
// Add to CouponRow type
category_restrictions?: {
  product_types?: string[] | null;
  course_basis?: string[] | null;
  product_categories?: string[] | null;
} | null;

// Add to SELECT query (both single and multi-code paths)
category_restrictions,

// After selecting coupon, before returning:
const couponType = selected?.coupons_types?.coupon_type;

// Guard: FIXED PRODUCT should not have restrictions
if (couponType === 'FIXED PRODUCT' && selected.category_restrictions) {
  console.warn('FIXED PRODUCT coupon has category_restrictions - ignoring', {
    couponId: selected.id,
    code: selected.code,
  });
  selected.category_restrictions = null;
}

// For other coupon types with restrictions, validate eligibility
if (
  couponType !== 'FIXED PRODUCT' &&
  selected.category_restrictions &&
  Array.isArray(cart)
) {
  const eligibleItems = cart.filter((item: CartItemForEligibility) =>
    isItemEligibleForCoupon(
      { _type: item._type, basis: item.basis, product: item.product },
      selected.category_restrictions
    )
  );
  
  if (eligibleItems.length === 0) {
    const description = getRestrictionDescription(selected.category_restrictions);
    return NextResponse.json(
      { error: `Ten kod rabatowy nie dotyczy żadnego produktu w koszyku. ${description || ''}` },
      { status: 400 }
    );
  }
  
  // Calculate eligible subtotal for response
  selected.eligibleSubtotal = eligibleItems.reduce(
    (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1),
    0
  );
  selected.eligibleItemIds = eligibleItems.map(i => i.product);
}
```

#### 2.2 Update coupon get: `next/src/app/api/coupon/get/route.ts`

Add `category_restrictions` to SELECT query.

#### 2.3 Update payment create: `next/src/app/api/payment/create/route.ts`

**Major changes:**

1. Import eligibility helpers
2. Separate products subtotal from delivery in all calculations
3. For cart-wide coupons with restrictions, calculate eligible subtotal
4. Never include delivery in discount calculation (except FREE DELIVERY)

```typescript
import { 
  isItemEligibleForCoupon, 
  calculateEligibleSubtotal,
  type CategoryRestrictions 
} from '@/utils/coupon-eligibility';

// In discount calculation section:

// Calculate products subtotal (NEVER include delivery for discounts)
const productsSubtotal = productItems.reduce(
  (acc, p) => acc + (typeof p.discount === 'number' ? p.discount : p.price) * (p.quantity ?? 1),
  0
);
const deliveryAmount = input.needDelivery ? (input.shippingMethod?.price ?? 0) : 0;

// For FIXED PRODUCT coupons (unchanged logic, but ensure no delivery)
const fixedProductTotal = fixedProduct.reduce((sum, d) => sum + computeFixedProductTotal(d), 0);

// For cart-wide coupons
let cartWideUsed = 0;
if (cartWide.length === 1 && discountsArray.length === 1) {
  const d = cartWide[0]!;
  const restrictions = d.category_restrictions as CategoryRestrictions;
  
  // Calculate eligible subtotal
  let eligibleSubtotal = productsSubtotal;
  if (restrictions) {
    const eligibleItems = productItems.filter(item =>
      isItemEligibleForCoupon(
        { _type: item.type as any, basis: item.basis, product: item.id },
        restrictions
      )
    );
    eligibleSubtotal = eligibleItems.reduce(
      (sum, p) => sum + (typeof p.discount === 'number' ? p.discount : p.price) * (p.quantity ?? 1),
      0
    );
  }
  
  if (d.type === 'PERCENTAGE') {
    const pct = Math.max(0, Math.min(100, d.amount));
    // Percentage of eligible products only - NO DELIVERY
    cartWideUsed = Math.floor((eligibleSubtotal * pct) / 100);
  } else if (d.type === 'FIXED CART') {
    // Fixed amount capped at eligible products - NO DELIVERY
    cartWideUsed = Math.min(d.amount, eligibleSubtotal);
  }
}

// Voucher calculation
let voucherUsed = 0;
if (voucher.length > 0) {
  const v = voucher[0]!;
  const restrictions = v.category_restrictions as CategoryRestrictions;
  
  // Calculate remaining after other discounts
  const afterOtherDiscounts = Math.max(0, productsSubtotal - fixedProductTotal - cartWideUsed);
  
  // If voucher has restrictions, cap by eligible subtotal
  let voucherBase = afterOtherDiscounts;
  if (restrictions) {
    const eligibleSubtotal = productItems
      .filter(item => isItemEligibleForCoupon(
        { _type: item.type as any, basis: item.basis },
        restrictions
      ))
      .reduce((sum, p) => sum + (p.discount ?? p.price) * (p.quantity ?? 1), 0);
    voucherBase = Math.min(afterOtherDiscounts, eligibleSubtotal);
  }
  
  voucherUsed = Math.min(voucherBase, v.amount);
}

// Calculate final total: discounted products + FULL delivery
const combinedDiscount = cartWideUsed > 0 ? cartWideUsed : fixedProductTotal + voucherUsed;
const computedFinalTotal = Math.max(0, productsSubtotal - combinedDiscount) + deliveryAmount;
```

---

### Phase 3: Frontend Updates

#### 3.1 Update discount calculation: `next/src/utils/calculate-discount-amount.ts`

**Complete rewrite to exclude delivery:**

```typescript
import type { Discount } from '@/global/types';

/**
 * Calculate the discount amount for a single coupon.
 * 
 * @param productsSubtotal - Total price of products (NOT including delivery)
 * @param discount - The discount object
 * @param eligibleSubtotal - For restricted coupons: subtotal of eligible items only
 * @returns Negative number representing the discount (e.g., -5000 for 50 PLN off)
 */
export function calculateDiscountAmount(
  productsSubtotal: number,
  discount: Discount,
  eligibleSubtotal?: number
): number {
  // Use eligible subtotal if provided (for category-restricted coupons)
  const baseAmount = eligibleSubtotal ?? productsSubtotal;
  
  if (discount.type === 'PERCENTAGE') {
    // Percentage of (eligible) products only - NO DELIVERY
    return -Math.floor((baseAmount * discount.amount) / 100);
  }

  if (discount.type === 'FIXED CART') {
    // Fixed amount capped at (eligible) products subtotal - NO DELIVERY
    return baseAmount >= discount.amount ? -discount.amount : -baseAmount;
  }
  
  if (discount.type === 'VOUCHER') {
    // Voucher capped at (eligible) products subtotal - NO DELIVERY
    return -Math.min(baseAmount, discount.amount ?? 0);
  }

  if (discount.type === 'FIXED PRODUCT') {
    // Per eligible line item (unchanged logic)
    const eligibleCount =
      typeof (discount as unknown as { eligibleCount?: number }).eligibleCount === 'number'
        ? (discount as unknown as { eligibleCount?: number }).eligibleCount!
        : 1;
    const aggregates = (discount as unknown as { aggregates?: boolean }).aggregates;
    const unitsUsed = aggregates === false ? Math.min(1, Math.max(0, eligibleCount)) : Math.max(0, eligibleCount);
    const total = discount.amount * unitsUsed;
    return total > productsSubtotal ? -productsSubtotal : -total;
  }

  if (discount.type === 'DELIVERY') {
    // This is the ONLY type that affects delivery
    // Return 0 here; delivery discount handled separately in total calculation
    return 0;
  }

  return 0;
}

/**
 * Calculate delivery discount (only for FREE DELIVERY coupon type).
 */
export function calculateDeliveryDiscount(
  discount: Discount | null | undefined,
  deliveryAmount: number
): number {
  if (!discount || discount.type !== 'DELIVERY') return 0;
  return -deliveryAmount;
}
```

#### 3.2 Update Cart component: `next/src/components/_global/Header/_Cart.tsx`

**Changes:**

1. Import eligibility helpers
2. When mapping coupon response, include `category_restrictions` and calculate `eligibleSubtotal`
3. Update `discountsAmount` calculation to use eligible subtotals
4. (Optional) Show restriction info in UI

```typescript
import { 
  isItemEligibleForCoupon, 
  getRestrictionDescription,
  type CategoryRestrictions 
} from '@/utils/coupon-eligibility';

// In verifyCoupon function, when mapping response:
const mapped: Discount[] = list.map((data: {...}) => {
  const type = data.coupons_types?.coupon_type;
  const restrictions = data.category_restrictions as CategoryRestrictions;
  
  // Calculate eligible count for FIXED PRODUCT (existing logic)
  // ...
  
  // Calculate eligible subtotal for restricted coupons
  let eligibleSubtotal: number | undefined;
  let eligibleItemIds: string[] | undefined;
  
  if (type !== 'FIXED PRODUCT' && restrictions && fetchedItems) {
    const eligibleItems = fetchedItems.filter(item =>
      isItemEligibleForCoupon(
        { _type: item._type, basis: item.basis, _id: item._id },
        restrictions
      )
    );
    eligibleSubtotal = eligibleItems.reduce(
      (sum, item) => sum + (item.discount ?? item.price ?? 0) * (item.quantity ?? 1),
      0
    );
    eligibleItemIds = eligibleItems.map(i => i._id);
  }
  
  return {
    // ...existing fields...
    category_restrictions: restrictions,
    eligibleSubtotal,
    eligibleItemIds,
  } as Discount;
});

// Update discountsAmount calculation:
const discountsAmount = useMemo(() => {
  if (!Array.isArray(usedDiscounts) || usedDiscounts.length === 0 || typeof totalItemsPrice !== 'number') return 0;
  
  // Products subtotal (NO delivery in discount calculation)
  const productsSubtotal = totalItemsPrice;
  
  // FIXED PRODUCT discounts (unchanged)
  const productTotal = usedDiscounts
    .filter((d) => d.type === 'FIXED PRODUCT')
    .reduce((sum, d) => sum + calculateDiscountAmount(productsSubtotal, d), 0);
  
  const baseAfterProducts = Math.max(0, productsSubtotal + productTotal);
  
  // Voucher (with eligible subtotal if restricted)
  const voucher = usedDiscounts.find((d) => d.type === 'VOUCHER');
  const voucherTotal = voucher 
    ? calculateDiscountAmount(baseAfterProducts, voucher, voucher.eligibleSubtotal)
    : 0;
  
  // Cart-wide discount (with eligible subtotal if restricted)
  const cartWide = usedDiscounts.find((d) => d.type === 'PERCENTAGE' || d.type === 'FIXED CART');
  if (cartWide && usedDiscounts.length === 1) {
    return calculateDiscountAmount(productsSubtotal, cartWide, cartWide.eligibleSubtotal);
  }
  
  return productTotal + voucherTotal;
}, [usedDiscounts, totalItemsPrice]);

// Note: delivery is now added AFTER discount calculation in the total
// Total = (productsSubtotal + discountsAmount) + delivery
```

#### 3.3 Update OrderData component: `next/src/components/_dashboard/OrderData/OrderData.tsx`

Update discount display calculation for historical orders. Note: existing orders were calculated with the old logic (delivery included), so we may need to display them as-is based on stored `amount` values rather than recalculating.

#### 3.4 Update Checkout components

Ensure `discounts` array passed to payment API includes `category_restrictions` field.

---

### Phase 4: Bill Generation

#### 4.1 Update generate-bill: `next/src/app/api/payment/complete/generate-bill.ts`

The invoice generation needs to reflect the new calculation logic. Discounts should only reduce product line items, not delivery.

---

## Testing Matrix

### Category Restriction Tests

| Scenario | Expected Result |
|----------|-----------------|
| PERCENTAGE for crocheting courses, cart has crocheting + knitting | Discount only on crocheting |
| FIXED CART 400 PLN for courses, cart has 250 PLN course | Discount = 250 PLN (capped) |
| VOUCHER for products only, cart has courses + products | Voucher applies to products only |
| Coupon with no restrictions | Applies to all products (not delivery) |
| No eligible items in cart | Reject coupon with clear error |
| FIXED PRODUCT with restrictions (edge case) | Ignore restrictions, use discounted_products |

### Delivery Exclusion Tests

| Scenario | Expected Result |
|----------|-----------------|
| FIXED CART 400 PLN, cart 250 PLN + 16 PLN delivery | Pay 16 PLN (full delivery) |
| PERCENTAGE 100%, cart 200 PLN + 20 PLN delivery | Pay 20 PLN (full delivery) |
| VOUCHER 500 PLN, cart 100 PLN + 15 PLN delivery | Pay 15 PLN, voucher used = 100 PLN |
| FREE DELIVERY coupon | Delivery = 0 PLN |

### Backward Compatibility Tests

| Scenario | Expected Result |
|----------|-----------------|
| Old coupon (null restrictions) | Works for all products |
| Old orders with delivery in discount | Display correctly from stored amounts |
| Single coupon legacy flow | Still works |
| Multi-coupon with mixed restrictions | Each coupon applies to its eligible items |

---

## Implementation Checklist

### Phase 1: Utilities
- [x] Create `next/src/utils/coupon-eligibility.ts` with all helper functions
- [x] Update `next/src/global/types.ts` with `CategoryRestrictions` and updated `Discount` type

### Phase 2: API
- [x] Update `/api/coupon/verify/route.ts` - add `category_restrictions` to query and response
- [x] Update `/api/coupon/verify/route.ts` - add eligibility validation for restricted coupons
- [x] Update `/api/coupon/get/route.ts` - add `category_restrictions` to query
- [x] Update `/api/payment/create/route.ts` - separate products vs delivery calculation
- [x] Update `/api/payment/create/route.ts` - add eligible subtotal calculation for restricted coupons

### Phase 3: Frontend
- [x] Rewrite `next/src/utils/calculate-discount-amount.ts` to exclude delivery
- [x] Update `_Cart.tsx` - include restrictions in mapped discount data
- [x] Update `_Cart.tsx` - calculate eligible subtotals for restricted coupons
- [x] Update `_Cart.tsx` - fix total calculation (discount on products, then add delivery)
- [x] Update `OrderData.tsx` - handle new calculation for display
- [x] Update `_SummaryAside.tsx` - ensure correct total display

### Phase 4: Invoice
- [ ] Update `generate-bill.ts` - apply discounts to products only

### Phase 5: Testing
- [ ] Test category restrictions with various coupon types
- [ ] Test delivery exclusion scenarios
- [ ] Test backward compatibility with old coupons
- [ ] Test multi-coupon scenarios with mixed restrictions
- [ ] Regression test existing coupon flows

---

## Error Messages (Polish)

| Scenario | Message |
|----------|---------|
| No eligible items | "Ten kod rabatowy nie dotyczy żadnego produktu w koszyku. Dotyczy: [description]" |
| Coupon for courses only | "Dotyczy: kursy" |
| Coupon for crocheting | "Dotyczy: szydełkowanie" |
| Coupon for instruction products | "Dotyczy: instrukcje" |

---

## Rollout Plan

1. **Utilities & Types**: Create shared helper functions and update types
2. **API Updates**: Update verify, get, and payment routes
3. **Frontend Updates**: Update discount calculation and cart components
4. **Invoice Updates**: Update bill generation
5. **QA**: Full testing using the testing matrix
6. **Deploy**: Ship to production

---

## Notes

- This is a **breaking change** for discount calculation (delivery no longer discounted)
- Historical orders will display correctly because we use stored `amount` values, not recalculate
- The admin panel already prevents FIXED PRODUCT coupons from having category restrictions
- FREE DELIVERY is the only coupon type that affects delivery cost
