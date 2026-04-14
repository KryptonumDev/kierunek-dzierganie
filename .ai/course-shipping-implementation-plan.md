# Course Shipping Implementation Plan

## Context

This plan is based on:

- the client email thread about sending welcome packages with selected course purchases
- repository-wide research in `kierunek-dzierganie`
- repository-wide research in `kierunek-dzierganie-admin`
- follow-up product decisions made during planning

The goal is to allow selected courses to participate in the existing shipping flow, so buyers can provide delivery details during checkout and the team can later create shipments from the existing admin dashboard.

For this release, the work is intentionally split into two phases:

1. storefront work in `kierunek-dzierganie`, including Sanity schema changes
2. minimal operational changes in `kierunek-dzierganie-admin`

This release does **not** include bulk shipment tooling.

---

## Locked Product Decisions

### 1. Shipping modes

Courses should support three shipping modes:

- `none`
- `included`
- `paid`

Meaning:

- `none`: course behaves like a normal digital product, no delivery step
- `included`: course requires delivery details, but shipping cost is `0`
- `paid`: course requires delivery details and standard shipping pricing applies

### 2. Bundle shipping inheritance

A bundle should inherit shipping behavior from its courses.

If at least one bundled course requires shipping, the bundle requires shipping.

### 3. Bundle precedence rule

Bundle shipping mode must resolve with this priority:

- `paid > included > none`

Examples:

- all courses `none` -> bundle `none`
- at least one `included` and no `paid` -> bundle `included`
- at least one `paid` -> bundle `paid`

Specific agreed example:

- one course has no shipping
- one course has included shipping
- one course has paid shipping
- result for the bundle: `paid`

### 4. Admin scope for this release

The admin/dashboard work should stay minimal.

In scope:

- make sure orders created from shipped courses work in the existing operational flow
- make sure operators can still create shipments from those orders
- add only minimal visibility if needed

Out of scope:

- bulk shipment creation
- mass actions for welcome-package orders
- warehouse automation beyond the current per-order flow

---

## Executive Summary

The existing platform already has a working shipping flow for physical products:

- cart items expose `needDelivery`
- checkout can collect shipping method and shipping address
- the payment API stores `need_delivery`, `shipping`, and `shipping_method`
- the admin dashboard uses those fields to create Apaczka shipments

The problem is that courses and bundles are explicitly excluded from this shipping system today.

Current behavior:

- `product` lines are treated as shippable
- physical `voucher` lines are treated as shippable
- `course` lines are treated as non-shippable
- `bundle` lines are treated as non-shippable

So this feature does **not** require building a new shipping architecture. It requires extending the existing one so courses and bundles can participate in it consistently and safely.

The recommended approach is:

1. add a shipping mode field to courses in Sanity
2. derive bundle shipping from included courses
3. carry resolved shipping metadata into cart and checkout
4. recompute shipping server-side in the payment API
5. persist line-level shipment metadata on the order
6. update the admin dashboard so shipped course orders can still be processed

---

## Repository Diagnosis

### Storefront / Sanity

Important files in `kierunek-dzierganie`:

- `sanity/schemas/collectionTypes/Course_Collection.jsx`
- `next/src/global/constants.ts`
- `next/src/global/types.ts`
- `next/src/utils/useCartItems.ts`
- `next/src/utils/validate-guest-cart.ts`
- `next/src/components/_global/Header/Checkout/Checkout.tsx`
- `next/src/components/_global/Header/Checkout/_PersonalData.tsx`
- `next/src/components/_global/Header/_Cart.tsx`
- `next/src/app/api/payment/create/route.ts`

What already exists:

- shipping methods and delivery UI
- shipping address collection
- order-level shipping persistence
- admin dashboard integration via `need_delivery`

What does not exist yet:

- course shipping configuration in Sanity
- bundle shipping resolution from child courses
- course/bundle shipping propagation into cart items
- server-side shipping revalidation for courses
- line-level metadata explaining why a course order needs shipment

### Admin dashboard

Important files in `kierunek-dzierganie-admin`:

- `src/app/(authorized)/orders/(order)/[id]/aside.tsx`
- `src/app/api/apaczka/create-order/route.ts`
- `src/app/(authorized)/orders/_table.tsx`
- `src/global/types.ts`

What already exists:

- order list and order detail views
- shipment creation per order
- shipment tracking / waybill visibility
- order CSV export

What does not exist yet:

- understanding of course-specific shipment metadata
- inclusion of non-`product` shippable lines when generating a shipment
- batch shipment tools

---

## Desired Business Behavior

### Course level

Each course should have a shipping mode configured in Sanity:

- `none`
- `included`
- `paid`

### Bundle level

Bundles should not have a separately maintained shipping mode for this release.

Instead, bundle shipping should be derived from bundled courses using:

- `paid > included > none`

### Cart / order level

The whole order should resolve to one shipping mode using the same precedence:

- if any line resolves to `paid`, the order is `paid`
- else if any line resolves to `included`, the order is `included`
- else the order is `none`

This rule should be used consistently in:

- cart display
- checkout UI
- order totals
- payment API validation
- stored order metadata

### Account requirement

Shipping requirement and account requirement must stay separate.

Courses still require an account because access is granted after purchase.

So:

- course shipping must **not** enable guest checkout
- guest checkout remains physical-only unless handled in a separate project

---

## Recommended Data Model

### Course source of truth in Sanity

Add to `course`:

- `shippingMode: 'none' | 'included' | 'paid'`

Optional helper field:

- `shippingLabel` for customer-facing checkout/cart copy such as `Ten kurs zawiera pakiet powitalny wysyłany po zakupie`
- `shippingNote` for internal informational text if operations need extra clarity (optional future use; not in CMS today)

For this release, only `shippingMode` is required.

### Meaning of the helper text

`shippingLabel` should be customer-facing text shown in cart and/or checkout so the buyer understands why they are being asked for delivery details even though they are buying a course.

Examples:

- `Ten kurs zawiera pakiet powitalny wysyłany po zakupie`
- `Do tego kursu wyślemy pakiet powitalny`
- `Zakup tego kursu wymaga podania danych do wysyłki pakietu powitalnego`

### Order line metadata

Each order line in `products.array` should carry enough information for operational handling:

- `shipmentRequired: boolean`
- `shipmentMode: 'none' | 'included' | 'paid'`
- `shipmentSource: 'product' | 'voucher' | 'course' | 'bundle'`
- `shipmentLabel?: string`

This avoids guessing from `type` alone in the admin dashboard.

### Database impact

No new Supabase columns are required for this release because:

- `orders.need_delivery` already exists
- `orders.shipping` already exists
- `orders.shipping_method` already exists
- `orders.products` already stores structured JSON

---

## Phase 1: Storefront Strategy

This phase covers both the public storefront and Sanity because they live in the same repository.

### 1. Add course shipping fields in Sanity

Update:

- `sanity/schemas/collectionTypes/Course_Collection.jsx`

Add:

- `shippingMode`
- optionally `shippingLabel`

Recommended editor UX:

- section label: `Wysyłka po zakupie`
- options:
  - `Brak`
  - `Wliczona w cenę`
  - `Płatna`

Recommended customer-facing copy behavior:

- `shippingLabel` should be shown to the buyer in the cart and/or checkout
- the purpose is to explain why delivery details are required for a course purchase

### 2. Expose shipping fields in storefront queries and types

Update:

- `next/src/global/constants.ts`
- `next/src/global/types.ts`

The goal is for course and bundle payloads to carry enough information to compute:

- whether shipping is required
- whether it is `included` or `paid`

Important detail:

Bundle queries must expose enough child-course shipping data to resolve bundle mode without relying on brittle client-only assumptions.

### 3. Add a shared shipping resolver

Recommended new utility:

- `next/src/utils/resolve-shipping-mode.ts`

This utility should normalize the rules for:

- product -> `paid`
- physical voucher -> `paid`
- digital voucher -> `none`
- course -> `none` / `included` / `paid`
- bundle -> derived from child courses using `paid > included > none`

This should become the single source of truth used by:

- cart mapping
- checkout state
- totals calculation
- payment API validation

### 4. Update cart item mapping

Update:

- `next/src/utils/useCartItems.ts`

Current issue:

- cart items default to `needDelivery: item._type === 'product'`
- courses and bundles are therefore excluded from delivery

Required change:

- replace direct type checks with the shared shipping resolver
- store both `needDelivery` and the resolved `shippingMode`

### 5. Update checkout state and UI

Update:

- `next/src/components/_global/Header/Checkout/Checkout.tsx`
- `next/src/components/_global/Header/Checkout/Checkout.types.ts`
- `next/src/components/_global/Header/Checkout/_PersonalData.tsx`
- `next/src/components/_global/Header/Checkout/_SummaryAside.tsx`
- `next/src/components/_global/Header/_Cart.tsx`

Required behavior:

- if order mode is `none`, no delivery UI
- if order mode is `included`, show delivery UI but charge `0`
- if order mode is `paid`, show delivery UI and apply normal shipping pricing

This is an important conceptual split:

- `delivery required`
- `delivery charged`

These are no longer the same thing.

### 6. Keep guest checkout unchanged for courses

Update:

- `next/src/utils/validate-guest-cart.ts`

Rule should remain:

- course and bundle carts still require an account

Shipping on a course must **not** accidentally make it behave like a guest-eligible physical-only cart.

### 7. Free shipping behavior

The project already has a free-shipping mechanism in code:

- the storefront reads `settings.value.freeDeliveryAmount` from Supabase
- the cart and checkout receive it as `freeShipping`
- the order stores `free_delivery`

However, the current production value is `0`, which means the threshold is effectively disabled right now.

Practical consequence for this release:

- the shipped-course implementation must not depend on free-shipping behavior being active
- but the logic should remain compatible if the threshold is enabled later

Recommended rule:

- free-shipping threshold logic only matters when the resolved order mode is `paid`
- if the resolved order mode is `included`, delivery remains `0` regardless of threshold

Resolution order:

1. resolve item shipping modes
2. resolve overall order shipping mode
3. if order mode is `included`, delivery charge is `0`
4. if order mode is `paid`, apply existing delivery pricing
5. if a future non-zero free-shipping threshold is configured, it may reduce that paid delivery to `0`

So for the current rollout:

- there is no active free-shipping threshold in production
- `included` vs `paid` is the only shipping-price distinction that currently matters

### 8. Virtual money behavior

Current code allows virtual money for course and bundle purchases.

This creates a business decision:

- either shipped courses still remain eligible because they are still courses
- or shipped courses become ineligible because they include physical fulfillment

Recommended for this release:

- keep the current rule unchanged unless the business explicitly decides otherwise
- but include this in QA because it affects totals and customer expectations

Files affected:

- `next/src/utils/can-use-virtual-money.ts`
- `next/src/app/api/payment/create/route.ts`

### 9. Harden the payment API

This is mandatory.

Current issue:

- `next/src/app/api/payment/create/route.ts` trusts client-provided `needDelivery`
- delivery amount is derived from client state instead of fully revalidated server-side

Required change:

- fetch fresh product/course/bundle shipping source data on the server
- resolve item shipping modes again on the server
- resolve order shipping mode again on the server
- compute final delivery amount on the server
- reject inconsistent payloads

### 10. Persist shipment metadata on order lines

When checkout builds `products.array`, include line-level shipment metadata so the admin dashboard can tell:

- which line triggered shipment
- whether it was `included` or `paid`
- whether the shipment comes from a course, bundle, product, or voucher

### 11. Add customer-facing explanation in UI

Recommended places to render `shippingLabel`:

- on the shipped course line in the cart
- near the delivery section in checkout
- optionally in the order summary

The purpose is to avoid confusion when a course purchase suddenly asks for shipping details.

### 12. Storefront acceptance criteria

Phase 1 is complete when:

- a course with `none` behaves like a normal digital course
- a course with `included` collects delivery details and charges `0`
- a course with `paid` collects delivery details and charges standard shipping
- a bundle with at least one `included` and no `paid` resolves to `included`
- a bundle with at least one `paid` resolves to `paid`
- the payment API revalidates shipping safely
- guest checkout remains blocked for course and bundle carts
- order lines include shipment metadata

---

## Phase 2: Admin Dashboard Strategy

This phase should stay intentionally small.

### 1. Support shipped course lines in per-order shipment flow

Current issue:

- `src/app/(authorized)/orders/(order)/[id]/aside.tsx` filters shipment lines with `el.type === 'product'`

That means a shipped course or bundle would not flow correctly into shipment generation.

Required change:

- replace hardcoded `product` filtering with shipment metadata
- include any line with `shipmentRequired === true`

This should cover:

- physical products
- physical vouchers
- shipped courses
- shipped bundles

### 2. Keep the current per-order Apaczka workflow

Current shipment creation already lives in:

- `src/app/(authorized)/orders/(order)/[id]/aside.tsx`
- `src/app/api/apaczka/create-order/route.ts`

For this release, keep that workflow as-is:

- operator opens an order
- operator creates shipment for that order

No bulk workflow should be added now.

### 3. Add minimal operator visibility

Recommended small UI additions:

- show which order line triggered shipping
- show whether shipment is `included` or `paid`
- optionally show `shipmentLabel` (customer-facing copy persisted on the order line) if configured

Likely affected files:

- `src/app/(authorized)/orders/(order)/[id]/_products.tsx`
- `src/app/(authorized)/orders/(order)/[id]/content.tsx`
- `src/global/types.ts`

### 4. Update admin types

Update:

- `src/global/types.ts`
- `src/app/(authorized)/orders/(order)/[id]/types.ts`

The dashboard must be able to read the new shipment metadata stored in `orders.products`.

### 5. Admin acceptance criteria

Phase 2 is complete when:

- shipped course orders appear as deliverable orders
- operators can create Apaczka shipments from those orders
- shipment generation no longer assumes only `product` lines are shippable
- order details make it clear why the order requires shipment
- no bulk shipment or batch tooling is introduced

---

## Suggested Implementation Order

1. Add Sanity schema fields on `course`
2. Extend storefront queries and types
3. Build shared shipping resolution utility
4. Update cart item mapping
5. Update checkout state, totals, and customer-facing UI
6. Harden server-side validation in payment creation
7. Persist line-level shipment metadata on orders
8. Update admin dashboard per-order shipment handling
9. Run QA across both repos

---

## QA Matrix

### Storefront scenarios

- course with `none`
- course with `included`
- course with `paid`
- bundle with all `none`
- bundle with `included` and `none`
- bundle with `paid` and `included`
- bundle with `paid`, `included`, and `none`
- course with included shipping plus physical product
- course with paid shipping plus physical product
- multiple shipped courses in one order
- free order created by coupon
- order using virtual money
- guest attempt with shipped course in cart

### Admin scenarios

- shipped course order visible as deliverable
- shipped bundle order visible as deliverable
- Apaczka shipment creation works for shipped-course orders
- order detail view explains shipment source
- standard physical-product orders still behave as before

---

## Risks and Open Questions

### 1. Virtual money policy

The current system allows virtual money for courses and bundles.

If the business later decides that shipped courses should block virtual money, that must be implemented explicitly as a separate rule change.

### 2. Free-shipping threshold semantics

The threshold system exists technically, but the current production `freeDeliveryAmount` is `0`, so it is not active today.

The recommended approach remains:

- `included` shipping ignores threshold because it is already free by definition
- `paid` shipping can still respect the threshold if that feature is re-enabled later

### 3. Bundle payload depth

Bundle shipping depends on child-course shipping data being available in queries.

If the current bundle payload is too shallow, the query layer must be expanded before the resolver is finalized.

### 4. Operational shipment labeling

Use `shippingLabel` in Sanity for buyer-facing explanation; the same text can be persisted on order lines as `shipmentLabel` for admin clarity.

### 5. No bulk flow in this release

This release solves:

- delivery data collection for shipped courses
- shipping-aware order creation
- compatibility with the existing per-order admin shipment flow

This release does **not** solve:

- one-click shipment creation for hundreds of welcome-package orders

---

## Scope Statement

This release should be treated as:

- extending the existing shipping architecture to selected courses and bundles
- collecting delivery details during course checkout when needed
- storing enough metadata for operations to process those orders correctly
- keeping the admin work minimal and per-order

This release should not be treated as:

- a bulk fulfillment automation project
- a warehouse tooling project
- a redesign of guest checkout
- a redesign of the entire discount or shipping promotion system

