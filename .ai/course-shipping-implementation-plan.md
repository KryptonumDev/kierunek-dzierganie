# Course Shipping / Welcome Package - Two-Phase Implementation Plan

Updated: 2026-03-24

## Background

### Client request

The client wants selected courses, mainly larger program-style offers, to support shipping during checkout.

Business reason:

- some programs include a physical welcome package,
- collecting shipping data manually after a launch is too time-consuming,
- the preferred editorial workflow is a simple checkbox on the course in CMS.

### Product interpretation

This feature should not be treated as "convert courses into physical products".

It should be treated as:

- keep the course as a digital enrollment,
- keep course access and ownership logic unchanged,
- but allow selected courses to require fulfillment,
- so checkout collects delivery details and the order enters the shipping workflow.

That is the cleanest business and technical framing.

---

## What Changed After Reviewing The Admin Repo

The original assumption was that most work would be in the storefront and CMS repo, and the admin panel might only need a light compatibility check.

After reviewing `/Users/oliwiersellig/Developer/kierunek-dzierganie-admin`, that assumption is no longer valid.

### Main admin findings

1. The admin panel already trusts `orders.need_delivery` to decide whether an order is a shipping order.
2. The order detail view already shows a `Wysyłka` tab only when `need_delivery = true`.
3. The order detail sidebar already shows the `Apaczka` shipment block only when `need_delivery = true`.
4. The critical problem is that parcel creation currently filters order lines down to `type === 'product'` only.
5. That means a delivery-required order created from a shipping-enabled course would appear as a shipping order in admin, but shipment generation could still be wrong or incomplete.

### Critical coupling point

Current admin parcel creation logic:

- reads `order.products.array`,
- keeps only lines where `type === 'product'`,
- recalculates parcel amount from those lines only,
- sends that reduced payload to the Apaczka API.

Implication:

- if a course requires shipping but remains `type === 'course'`, the admin panel will show shipping UI,
- but Apaczka shipment creation may send an empty set of shippable items or an incorrect declared value.

### Conclusion

Phase 2 is required.

This is a real two-repository feature:

- Phase 1 = storefront / CMS / order-shaping
- Phase 2 = admin-panel fulfillment updates

Without Phase 2, the client would get shipping data collection in checkout, but not a reliable operational fulfillment flow.

---

## High-Level Recommendation

Implement the feature as a course-level fulfillment flag, and shape the resulting order so the admin panel can understand and process it.

Recommended MVP approach:

1. Add a checkbox on the `course` schema in Sanity.
2. Make flagged courses trigger shipping UI in the storefront checkout.
3. Recompute shipping requirement on the server.
4. Persist delivery-friendly line-item metadata in `orders.products.array`.
5. Update the admin panel so shipment generation uses "shippable lines" rather than only `type === 'product'`.

This preserves the digital course model while enabling real-world fulfillment.

---

## Target Model

### Business model

A selected course or program remains:

- a digital product for access,
- but also a fulfillment-triggering item for shipping.

### Technical model

The order should carry two things:

1. Order-level shipping state
  - `need_delivery`
  - `shipping`
  - `shipping_method`
2. Line-level fulfillment metadata
  - which lines are physically fulfillable,
  - and why they are physically fulfillable.

### Recommended line-item metadata

For each persisted item in `orders.products.array`, add a field like:

```ts
fulfillment?: {
  required: boolean;
  source: 'physical-product' | 'welcome-package';
}
```

Why this is recommended:

- no DB migration is required if it lives inside the existing `products` JSON,
- the storefront can persist it at order creation time,
- the admin panel can read it without trying to infer fulfillment from `type` alone,
- the team can distinguish a physical product shipment from a course welcome package.

For MVP, this is better than adding a new top-level DB column.

---

## Admin Panel Context We Must Respect

When updating the storefront, we need to shape data for how the admin panel already works today.

### Current admin behavior

Relevant admin files:

- `src/app/(authorized)/orders/_table.tsx`
- `src/app/(authorized)/orders/_preview-popup.tsx`
- `src/app/(authorized)/orders/(order)/[id]/_tabs.tsx`
- `src/app/(authorized)/orders/(order)/[id]/aside.tsx`
- `src/app/api/apaczka/create-order/route.ts`

Current UX pattern:

1. Orders list
  - shows shipping-related controls when `need_delivery` is true.
2. Order detail
  - shows the `Wysyłka` tab only when `needDelivery` is true.
3. Sidebar
  - shows the `Apaczka` shipment block only when `needDelivery` is true.
4. Parcel creation
  - currently packages only `type === 'product'` lines.

This means the storefront must not only set `need_delivery` correctly, but also persist line data that Phase 2 can use safely.

---

## Two-Phase Plan

## Phase 1 - Storefront, CMS, and Order Model

Goal: make selected courses require shipping in checkout and persist orders in a way the admin panel can consume safely.

### Step 1.1 - Lock the business rules

Before coding, confirm:

1. Is shipping charged separately or included in the course price?
2. Should the feature apply to any `course`, or mainly to `program` entries?
3. Are bundles in scope for v1, or explicitly out of scope?
4. Do we need different customer-facing copy for welcome-package courses?
5. Is summing the full course lin e value acceptable as the parcel declared value for MVP, or is a separate declared value needed later?

Recommended MVP assumptions:

- use existing shipping methods and prices,
- keep bundles out of scope unless explicitly requested,
- keep guest checkout rules unchanged,
- accept line price as parcel value for v1 if a dedicated declared value field is not introduced.

### Step 1.2 - Add the CMS checkbox

Primary file:

- `sanity/schemas/collectionTypes/Course_Collection.jsx`

Add a boolean field such as:

```ts
{
  name: 'requiresShipping',
  type: 'boolean',
  title: 'Wymaga wysylki',
  initialValue: false,
  group: 'configuration',
}
```

Why:

- it matches the client request exactly,
- it keeps editorial control simple,
- it avoids creating fake physical SKUs.

### Step 1.3 - Expose the field to the storefront

Primary files:

- `next/src/global/constants.ts`
- `next/src/global/types.ts`

Tasks:

1. Add `requiresShipping` to the relevant Sanity queries.
2. Extend `ProductCard` and any related order-item typing.
3. Ensure cart hydration receives the field for course items.

### Step 1.4 - Change cart delivery logic from type-only to rule-based

Primary file:

- `next/src/utils/useCartItems.ts`

Current behavior:

- `product` lines require shipping,
- physical vouchers require shipping,
- courses do not require shipping.

New behavior:

- `product` => shipping required
- physical `voucher` => shipping required
- `course` with `requiresShipping === true` => shipping required

Recommended rule shape:

```ts
const requiresDelivery =
  item._type === 'product' ||
  (item._type === 'voucher' && el.voucherData.type === 'PHYSICAL') ||
  (item._type === 'course' && item.requiresShipping === true);
```

### Step 1.5 - Reuse the existing checkout UX

Primary files:

- `next/src/components/_global/Header/Checkout/Checkout.tsx`
- `next/src/components/_global/Header/Checkout/_PersonalData.tsx`
- `next/src/components/_global/Header/Checkout/_SummaryAside.tsx`
- `next/src/components/_global/Header/_Content.tsx`

Expected result:

1. User adds a shipping-enabled course.
2. Checkout computes `needDelivery = true`.
3. Existing delivery method UI appears.
4. Existing shipping address UI appears.
5. Existing Paczkomat / InPost flow continues to work.
6. Existing delivery cost settings continue to work.

This phase should avoid inventing any new customer-facing shipping workflow.

### Step 1.6 - Keep authentication rules unchanged

Primary file:

- `next/src/utils/validate-guest-cart.ts`

Recommendation:

- do not allow guest checkout for these course orders,
- keep all course purchases account-bound.

Reason:

- the order still grants digital access,
- course ownership should remain attached to a real user account.

### Step 1.7 - Make the server authoritative

Primary file:

- `next/src/app/api/payment/create/route.ts`

This is the most important implementation step in Phase 1.

Current issue:

- the server relies on `input.needDelivery` from the client.

Required change:

1. Re-read ordered item data on the server.
2. Fetch the shipping flag for relevant course items.
3. Recompute whether the order requires shipping.
4. Validate that shipping data is present when required.
5. Use the server-computed result for:
  - `deliveryAmount`
  - `need_delivery`
  - `shipping`
  - `shipping_method`
  - initial order status

This prevents the storefront from becoming the only source of truth.

### Step 1.8 - Persist admin-friendly fulfillment metadata

Primary file:

- `next/src/app/api/payment/create/route.ts`

When building `products.array`, persist fulfillment metadata per line.

Recommended persisted shape:

```ts
{
  ...existingItem,
  fulfillment: {
    required: boolean,
    source: 'physical-product' | 'welcome-package'
  }
}
```

Mapping recommendation:

- physical product => `required: true`, `source: 'physical-product'`
- shipping-enabled course => `required: true`, `source: 'welcome-package'`
- normal digital course => `required: false`
- bundle => `required: false` in v1 unless explicitly added to scope

Why this matters:

- the admin panel can use this in Phase 2 instead of relying on `type === 'product'`,
- the order becomes self-describing,
- no extra DB migration is required for the MVP.

### Step 1.9 - Preserve downstream behavior

Relevant storefront files:

- `next/src/app/api/payment/complete/process-background.ts`
- `next/src/app/api/payment/complete/send-emails.ts`
- `next/src/components/_dashboard/OrderData/OrderData.tsx`

Expected outcome:

- `need_delivery` continues to drive delivery-oriented emails,
- order status continues to follow the shipping-capable path,
- account order details continue to show delivery data normally.

### Step 1.10 - Phase 1 QA

Storefront QA checklist:

- Buy a normal course with `requiresShipping = false` -> no shipping UI
- Buy a course with `requiresShipping = true` -> shipping UI appears
- Confirm delivery cost is added correctly
- Confirm Paczkomat selection works
- Confirm order persists `need_delivery = true`
- Confirm order persists `shipping` and `shipping_method`
- Confirm order persists line-level `fulfillment` metadata
- Confirm course access is still granted after payment
- Confirm guest checkout remains blocked for course purchases

Phase 1 done means:

- the storefront correctly creates delivery-required course orders,
- and those orders are shaped for admin consumption.

---

## Phase 2 - Admin Panel Updates

Goal: make the admin panel operationally support shipping-enabled course orders, not just display them.

### Why Phase 2 is necessary

Current admin parcel generation is incompatible with course-driven shipping.

Primary admin file:

- `src/app/(authorized)/orders/(order)/[id]/aside.tsx`

Current behavior:

- filters parcel lines with `el.type === 'product'`,
- sums only those lines into `physicalSum`,
- sends only those lines to `/api/apaczka/create-order`.

If a course requires shipping:

- `need_delivery` may be true,
- the shipping tab may appear,
- but shipment creation may ignore the course line completely.

That is why Phase 2 is mandatory.

### Step 2.1 - Update admin order typing

Primary files:

- `kierunek-dzierganie-admin/src/global/types.ts`
- `kierunek-dzierganie-admin/src/app/(authorized)/orders/(order)/[id]/types.ts`
- `kierunek-dzierganie-admin/database.types.ts` if regenerated types are needed later

Tasks:

1. Extend `OrderProducts.array[]` typing to include the new `fulfillment` object.
2. Keep the existing `type` field unchanged.
3. Ensure order detail code can safely read the new metadata.

This is the foundation for all admin-side changes.

### Step 2.2 - Keep existing `need_delivery` UI gates, but enrich the meaning

Primary files:

- `src/app/(authorized)/orders/(order)/[id]/_tabs.tsx`
- `src/app/(authorized)/orders/_preview-popup.tsx`
- `src/app/(authorized)/orders/_table.tsx`

Good news:

- the current panel already uses `need_delivery` to show shipping-related UI.

Recommendation:

- keep that behavior,
- but add a visible explanation where useful, such as:
  - "Welcome package"
  - "Physical products"
  - "Mixed shipment"

This will help operations understand why an order ships.

### Step 2.3 - Fix shipment creation in the order sidebar

Primary file:

- `src/app/(authorized)/orders/(order)/[id]/aside.tsx`

This is the key Phase 2 implementation step.

Current logic:

- `physicalProducts = order.products.array.filter((el) => el.type === 'product')`

Required new logic:

- build `shippableItems` from fulfillment metadata, not only from `type`.

Recommended rule:

```ts
const shippableItems =
  order.products.array.filter(
    (item) => item.fulfillment?.required || item.type === 'product'
  );
```

Recommended amount logic for MVP:

```ts
const shippableSum = shippableItems.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);
```

This is not perfect for insurance semantics if a course price includes digital value, but it is a coherent MVP and much safer than the current product-only filter.

If the team later wants more precise parcel valuation, add a dedicated value field in v2.

### Step 2.4 - Keep Apaczka route compatible

Primary file:

- `src/app/api/apaczka/create-order/route.ts`

Good news:

- the route already accepts the order object and uses `order.amount` for `shipment_value`.

What Phase 2 needs:

- ensure the caller now passes the correct shippable amount and shippable items,
- no major route redesign should be necessary for MVP.

### Step 2.5 - Update the order detail view for operator clarity

Primary files:

- `src/app/(authorized)/orders/(order)/[id]/_products.tsx`
- `src/app/(authorized)/orders/(order)/[id]/content.tsx`
- `src/app/(authorized)/orders/_preview-popup.tsx`

Recommended UI additions:

1. Show a badge or label on a course line if it ships as a welcome package.
2. Show a simple shipment reason summary on the order detail page.
3. Keep the existing shipping tab logic unchanged.

This is important because the panel currently distinguishes line items mostly by `type`, and operators may otherwise assume course lines are always purely digital.

### Step 2.6 - Decide how much list/filter/export support is needed

Primary files:

- `src/actions/get-orders.ts`
- `src/actions/get-all-filtered-orders.ts`
- `src/utils/export-to-csv.ts`

For MVP:

- no dedicated DB-level filter is required,
- the panel can operate with delivery orders using `need_delivery`.

Recommended small improvements:

1. Add optional shipping-reason text in CSV export.
2. Add optional list badge in the orders table.

Do not overbuild filters unless operations explicitly ask for them.

### Step 2.7 - Update admin QA

Admin QA checklist:

- Delivery-required course order appears with shipping UI in admin
- `Wysyłka` tab appears for that order
- `Apaczka` block appears for that order
- Shipment creation succeeds even when the order has no `type === 'product'` lines
- Shipment creation succeeds for mixed orders: physical products + shipping-enabled course
- Order detail clearly indicates why shipping is required
- Tracking link and waybill download still work
- No regression for standard physical-product orders

Phase 2 done means:

- operations can actually fulfill the welcome-package order, not just view it.

---

## Open Decisions

These decisions should be confirmed before implementation starts:

1. Shipping price
  - charged separately using current methods,
  - or included in the course price?
2. Scope
  - any course,
  - or mainly programs?
3. Bundles
  - out of scope for v1,
  - or should a bundle inherit shipping from included courses?
4. Parcel declared value
  - use the full shippable line price in v1,
  - or add a more precise declared value in a later phase?

Recommended MVP answers:

- charged separately,
- applies to any course where editors enable it,
- bundles out of scope,
- use the shippable line price as parcel value for v1.

---

## Likely Files To Change

### Storefront / CMS repo


| File                                                            | Purpose                                             |
| --------------------------------------------------------------- | --------------------------------------------------- |
| `sanity/schemas/collectionTypes/Course_Collection.jsx`          | Add `requiresShipping` checkbox                     |
| `next/src/global/constants.ts`                                  | Expose field in queries                             |
| `next/src/global/types.ts`                                      | Extend types and order-item metadata                |
| `next/src/utils/useCartItems.ts`                                | Compute delivery for flagged courses                |
| `next/src/components/_global/Header/Checkout/Checkout.tsx`      | Aggregate delivery state                            |
| `next/src/components/_global/Header/Checkout/_PersonalData.tsx` | Reuse existing shipping form                        |
| `next/src/components/_global/Header/Checkout/_SummaryAside.tsx` | Confirm delivery display                            |
| `next/src/app/api/payment/create/route.ts`                      | Recompute shipping and persist fulfillment metadata |


### Admin repo


| File                                                     | Purpose                                                              |
| -------------------------------------------------------- | -------------------------------------------------------------------- |
| `src/global/types.ts`                                    | Extend order item typing with `fulfillment`                          |
| `src/app/(authorized)/orders/(order)/[id]/types.ts`      | Order detail typing alignment                                        |
| `src/app/(authorized)/orders/(order)/[id]/aside.tsx`     | Build Apaczka payload from shippable items, not just `product` lines |
| `src/app/(authorized)/orders/(order)/[id]/_products.tsx` | Show welcome-package / shipping-reason context                       |
| `src/app/(authorized)/orders/_preview-popup.tsx`         | Surface shipping reason in preview if useful                         |
| `src/app/(authorized)/orders/_table.tsx`                 | Optional badge or label in list view                                 |
| `src/utils/export-to-csv.ts`                             | Optional shipping-reason export                                      |


---

## Final Recommendation

Proceed as a two-phase feature.

### Phase 1

Update the storefront and CMS so selected courses can require shipping and so orders are persisted with admin-friendly fulfillment metadata.

### Phase 2

Update the admin panel so shipment generation and operator UX no longer assume that only `type === 'product'` lines are physically fulfillable.

This is now the correct implementation strategy.

The key lesson from the admin review is:

- `need_delivery` is enough to show the shipping UI,
- but it is not enough to make fulfillment work correctly.

That is why the plan must explicitly include Phase 2.

# Course Shipping / Welcome Package - Implementation Plan

Updated: 2026-03-24

## Background

### Client request

The client wants selected courses, mainly larger "program" offers, to support shipping during checkout.

Business reason:

- Some programs include a physical welcome package.
- Manual shipment creation for a large cohort is operationally expensive.
- The ideal editor workflow is a simple checkbox on the course in CMS.

### Product interpretation

This is not really "make courses physical products".

It is:

- keep the course as a digital enrollment,
- keep course access logic unchanged,
- but mark selected courses as requiring fulfillment,
- so the checkout collects shipping details and the order enters the shipping workflow.

That framing is the safest business and technical approach.

---

## Executive Summary

### Recommendation

Implement a course-level CMS flag that marks a course or program as requiring shipping.

For MVP:

1. Add a checkbox in Sanity on the `course` schema.
2. Expose that flag to the storefront cart and checkout flow.
3. Reuse the existing shipping address and shipping-method UI.
4. Recompute shipping requirement on the server, not only on the client.
5. Save the order as `need_delivery = true` when the purchased course requires shipping.
6. Ensure the separate admin panel can treat such orders as shipment-ready.

### Why this approach is best

- It matches the client's requested CMS workflow.
- It avoids faking a welcome pack as a separate physical SKU.
- It keeps course access, email, and payment flows mostly unchanged.
- It reuses the existing delivery pipeline already present in checkout and orders.
- It minimizes schema and product-model complexity.

---

## Business Diagnosis

### What problem the client is actually trying to solve

The client is not asking for a shipping feature in isolation. They are asking for operational scalability.

Current pain point:

- sell a digital program,
- collect participants,
- then manually generate shipments for welcome packages.

Desired outcome:

- the order should already contain shipping details,
- the order should automatically appear as a shippable order,
- fulfillment should be possible in the admin workflow with minimal manual setup.

### Business value

This feature creates value in four places:

1. Operations
  Reduces manual shipping setup during large launches.
2. Customer experience
  One purchase captures both digital access and physical delivery details.
3. Editorial control
  The team can enable it per selected course/program in CMS.
4. Fulfillment visibility
  Orders can clearly enter a shipping-required pipeline.

### Main business decision to lock before implementation

These decisions must be confirmed before development starts:

1. Is shipping paid by the customer or included in the course price?
2. Should selected courses use the existing global shipping methods and prices?
3. Should this apply only to `program` courses, or to any `course` document?
4. How should bundles behave if they contain a shipping-enabled course?
5. Should loyalty wallet and coupon behavior remain exactly the same for these orders?

My default MVP assumption:

- shipping uses the existing shipping methods,
- shipping price is charged normally,
- any `course` can opt into shipping,
- bundles are out of scope unless explicitly required.

---

## Repository Diagnosis

### Repo role

This repository is the storefront plus CMS layer.

- `next/` contains the customer-facing store, checkout, payment flow, and account area.
- `sanity/` contains the CMS schema and editorial setup.

There is also a separate admin panel in another codebase connected to the same transactional backend.

### Backend services used here

- `Supabase` for orders, profiles, course access, coupons, and settings
- `Sanity` for CMS content
- `Przelewy24` for payments
- `iFirma` for invoices
- `Resend` for emails
- `Apaczka` / `InPost` for shipping method UI and pickup-point selection

### Important architectural finding

Shipping is currently derived mostly from item type, not from a configurable CMS flag.

Today:

- `product` => requires shipping
- physical `voucher` => requires shipping
- `course` => does not require shipping
- `bundle` => does not require shipping

So the platform already supports delivery flows, but only for item types that are hardcoded as shippable.

### Important product-model finding

`program` is not a separate purchase engine in this repo.

It is an editorial subtype on the `course` schema:

- `type: 'course' | 'program'`

That means a course-level checkbox is the correct CMS location for this feature.

---

## Current Flow Today

### Purchase flow

1. User adds products to cart.
2. Cart items are hydrated from Sanity.
3. Checkout builds `InputState`.
4. `needDelivery` is derived from cart items.
5. Checkout collects billing and, if needed, shipping data.
6. `/api/payment/create` creates the order and payment session.
7. Payment completion grants access, sends emails, creates invoice, and updates order status.

### Where shipping is decided today

Relevant files:

- `next/src/utils/useCartItems.ts`
- `next/src/components/_global/Header/Checkout/Checkout.tsx`
- `next/src/app/api/payment/create/route.ts`

Current behavior:

- frontend computes `needDelivery`,
- checkout displays shipping UI only when `needDelivery` is `true`,
- backend uses `input.needDelivery` to add delivery cost and persist shipping fields.

### Why this matters

The UI is already capable of collecting shipping data for a course order.

The missing part is:

- a CMS-controlled rule that can make a course require shipping,
- plus backend validation so the server independently confirms that requirement.

---

## Recommended Solution

## Principle

Treat selected courses as:

- digitally fulfilled for access,
- physically fulfilled for welcome-package logistics.

Do not convert them into physical products.

### MVP shape

Add a new boolean flag to the course document, for example:

- `requiresShipping`

Meaning:

- if `false`, course behaves exactly as today,
- if `true`, checkout requires delivery details and order is persisted as a delivery order.

This is the simplest solution that matches the client's "checkbox in course" request.

---

## Detailed Implementation Strategy

### Phase 1 - Finalize rules and scope

Goal: avoid hidden complexity before coding.

Tasks:

1. Confirm whether shipping cost is charged separately or included.
2. Confirm whether the feature applies only to programs or to all courses.
3. Decide how bundles should behave.
4. Decide whether any course-specific shipping copy is needed in checkout or order emails.
5. Confirm how the admin panel should identify these orders for fulfillment.

Expected output:

- one locked MVP rule set,
- no ambiguity before schema or backend changes.

---

### Phase 2 - Add CMS control in Sanity

Goal: let editors enable shipping per course.

Primary file:

- `sanity/schemas/collectionTypes/Course_Collection.jsx`

Recommended field:

```ts
{
  name: 'requiresShipping',
  type: 'boolean',
  title: 'Wymaga wysylki',
  initialValue: false,
  group: 'configuration',
}
```

Optional v2 fields if needed later:

- `shippingDescription`
- `shippingIncluded`
- `fulfillmentTag`

For MVP, only the boolean is recommended.

Why:

- minimal editor complexity,
- directly aligned with the client's request,
- low risk to existing content.

---

### Phase 3 - Expose the flag to the storefront

Goal: make cart and checkout aware of the new rule.

Primary files:

- `next/src/global/constants.ts`
- `next/src/global/types.ts`

Tasks:

1. Add the new field to `PRODUCT_CARD_QUERY`.
2. Extend `ProductCard` with the new property.
3. Ensure course detail and cart hydration queries receive the field.

Suggested data model:

```ts
requiresShipping?: boolean;
```

Why:

- the frontend cannot compute shipping for courses until the CMS field is available in the fetched item data.

---

### Phase 4 - Replace type-only shipping logic with rule-based logic

Goal: make a selected course behave like a delivery-required order without changing its product type.

Primary file:

- `next/src/utils/useCartItems.ts`

Current logic:

- `needDelivery: item._type === 'product'`

Recommended logic:

- `product` => `true`
- physical `voucher` => `true`
- `course` with `requiresShipping === true` => `true`
- `bundle` => `true` only if explicitly included in scope

Recommended implementation idea:

```ts
const requiresDelivery =
  item._type === 'product' ||
  (item._type === 'voucher' && el.voucherData.type === 'PHYSICAL') ||
  (item._type === 'course' && item.requiresShipping === true);
```

If bundles are included later:

- either add a bundle-level flag,
- or infer from included course references,
- but do not decide this implicitly without product approval.

---

### Phase 5 - Reuse existing checkout UX

Goal: avoid building a new shipping flow.

Primary files:

- `next/src/components/_global/Header/Checkout/Checkout.tsx`
- `next/src/components/_global/Header/Checkout/_PersonalData.tsx`
- `next/src/components/_global/Header/Checkout/_SummaryAside.tsx`
- `next/src/components/_global/Header/_Content.tsx`

Expected behavior after Phase 4:

1. User adds a shipping-enabled course.
2. Checkout computes `needDelivery = true`.
3. Shipping method section appears automatically.
4. Shipping address section appears automatically.
5. Existing InPost / Paczkomat logic continues to work.
6. Delivery price is added using current shipping settings.

This is a strong reason to implement the feature this way:

- most UI infrastructure already exists.

---

### Phase 6 - Keep authentication requirement unchanged

Goal: preserve course-access rules.

Primary file:

- `next/src/utils/validate-guest-cart.ts`

Recommendation:

- do not enable guest checkout for shipping-enabled courses,
- keep account creation / login required for all course purchases.

Reason:

- the order still grants course access,
- access is tied to the user account,
- shipping does not change the digital ownership requirement.

This keeps the business logic coherent and avoids downstream access issues.

---

### Phase 7 - Harden the payment backend

Goal: make the server the source of truth for whether shipping is required.

Primary file:

- `next/src/app/api/payment/create/route.ts`

This is the most important implementation phase.

Current weakness:

- the server uses `input.needDelivery` from the client request.

Recommended change:

1. Read the real ordered items from `input.products.array`.
2. Fetch any required Sanity metadata for those item IDs.
3. Recompute whether delivery is required.
4. Recompute whether shipping fields are mandatory.
5. Persist `need_delivery`, `shipping`, and `shipping_method` from server-verified logic.
6. Use that computed result for `deliveryAmount` and initial status.

Why this matters:

- prevents incorrect or manipulated client payloads,
- keeps order data consistent,
- protects future admin-side automation.

Recommended validation outcomes:

- shipping-enabled course without shipping method => reject request
- shipping-enabled course with missing delivery data => reject request
- digital-only course without flag => no shipping charged

---

### Phase 8 - Preserve and enrich order semantics

Goal: make orders understandable to downstream systems.

Current good news:

- the order model already supports `need_delivery`,
- order emails already branch on `need_delivery`,
- order status flow already supports shipping-related states.

Relevant files:

- `next/src/app/api/payment/complete/process-background.ts`
- `next/src/app/api/payment/complete/send-emails.ts`
- `next/src/components/_dashboard/OrderData/OrderData.tsx`

Recommendation:

- keep reusing `need_delivery`,
- additionally store item-level metadata indicating why shipping is required.

Suggested per-item metadata:

- `requiresShipping: true`
- `shippingSource: 'course' | 'product' | 'voucher'`

Why:

- helps the separate admin panel understand that a digital course order still has fulfillment attached,
- reduces ambiguity for ops and future debugging.

---

### Phase 9 - Validate invoice and email behavior

Goal: ensure order communication stays coherent.

Relevant files:

- `next/src/app/api/payment/complete/generate-bill.ts`
- `next/src/app/api/payment/complete/send-emails.ts`
- `next/src/emails/Order/Order.tsx`

Expected result:

- invoice still includes shipping as a delivery line when applicable,
- order confirmation uses the delivery-aware branch,
- customer receives a normal delivery-capable order confirmation,
- internal team receives a delivery-capable order notification.

Potential UX improvement:

- optionally mention in the email that the course includes a welcome package.

This is a nice enhancement, not an MVP blocker.

---

### Phase 10 - Update the admin panel if needed

Goal: ensure the operational "one click shipment" promise is actually achieved.

This repository alone probably does not complete the client's full desired outcome.

Reason:

- I found checkout shipping collection and order persistence here,
- but I did not find server-side shipment-label creation in this codebase.

That strongly suggests the separate admin panel is where fulfillment actions actually happen.

So the admin panel must be checked for any assumptions like:

- "only physical product lines are shippable"
- "only orders containing `_type === product` can generate shipment"
- "shipping queue ignores delivery-required course orders"

This is the biggest cross-repo dependency.

---

## Recommended Technical Scope

### This repo

Likely changes in this repository:

1. Add `requiresShipping` to Sanity course schema.
2. Add the field to storefront queries and types.
3. Update cart item delivery logic.
4. Reuse checkout delivery UI for flagged courses.
5. Add server-side shipping recomputation in payment creation.
6. Optionally enrich stored order item metadata.

### Separate admin repo

Likely changes in the admin repository:

1. Ensure delivery-required course orders appear in fulfillment views.
2. Ensure shipment creation is allowed for such orders.
3. Ensure order detail UI explains why shipping is required.
4. Ensure any automations based on product type also handle course-triggered delivery.

---

## Files Most Likely To Change In This Repo


| File                                                            | Why                                      |
| --------------------------------------------------------------- | ---------------------------------------- |
| `sanity/schemas/collectionTypes/Course_Collection.jsx`          | Add CMS checkbox                         |
| `next/src/global/constants.ts`                                  | Expose new field in queries              |
| `next/src/global/types.ts`                                      | Add type support                         |
| `next/src/utils/useCartItems.ts`                                | Compute delivery for flagged courses     |
| `next/src/components/_global/Header/Checkout/Checkout.tsx`      | Aggregate delivery state                 |
| `next/src/components/_global/Header/Checkout/_PersonalData.tsx` | Reuse shipping form for flagged courses  |
| `next/src/components/_global/Header/Checkout/_SummaryAside.tsx` | Confirm delivery cost display            |
| `next/src/app/api/payment/create/route.ts`                      | Server-side recomputation and validation |


---

## Database Impact

### Initial view

This feature probably does not require a major database migration in this repo.

Reason:

- orders already store shipping details,
- orders already store `need_delivery`,
- status logic already supports shipment-oriented states.

Possible optional enhancement:

- add or persist better item-level metadata inside `orders.products.array`

That is likely enough for MVP unless the admin repo reveals a stronger schema dependency.

---

## Risks

### Risk 1 - Backend trusts the client too much

If the frontend alone decides `needDelivery`, order data can become inconsistent.

Mitigation:

- recompute on the server in `payment/create`.

### Risk 2 - Admin panel may assume only physical SKUs are shippable

If true, the checkout change will collect delivery data, but ops still will not get the promised workflow.

Mitigation:

- inspect admin repo before implementation is considered complete.

### Risk 3 - Bundle behavior can become unclear

If bundles include shipping-enabled courses, the business rule must be explicit.

Mitigation:

- exclude bundles from MVP unless the client explicitly needs them.

### Risk 4 - Shipping pricing may be ambiguous

If welcome packages are "included" in premium programs, existing global shipping charging may be wrong.

Mitigation:

- confirm whether delivery is charged or absorbed into price before implementation.

---

## Suggested MVP Decision Set

If we want the fastest safe version, I recommend this exact MVP:

1. Add `requiresShipping` boolean on `course`.
2. Support it for `course` documents only.
3. Keep guest checkout rules unchanged.
4. Reuse current shipping methods and current shipping prices.
5. Recompute shipping requirement server-side.
6. Save delivery-required course orders exactly like physical delivery orders.
7. Update the admin panel only as much as needed so those orders can enter shipment handling.

This is the cleanest path to business value with the lowest implementation risk.

---

## QA Plan

### Storefront QA

- Buy a normal course with `requiresShipping = false` -> no shipping UI
- Buy a course with `requiresShipping = true` -> shipping UI appears
- Buy a program with `requiresShipping = true` -> shipping UI appears
- Confirm delivery amount is added correctly
- Confirm InPost point selection works
- Confirm order is saved with `need_delivery = true`
- Confirm order is saved with shipping data
- Confirm course access is still granted after payment

### Backend QA

- Remove shipping data from a flagged course checkout payload -> server rejects
- Force `needDelivery = false` from client for a flagged course -> server still computes delivery
- Confirm correct order status after payment for a delivery-required course

### Admin / ops QA

- Delivery-required course order appears in fulfillment workflow
- Shipment creation action is available
- Order detail clearly shows shipping method and delivery data
- Ops can distinguish physical product shipments from course welcome-package shipments if needed

---

## What We Need From The Admin Repo

Before final implementation planning is complete, we should inspect these areas in the separate admin codebase:

1. Order list page
2. Order detail page
3. Shipping queue or fulfillment filters
4. Shipment / label generation logic
5. Any logic that checks order line item type before enabling shipment actions

This will tell us whether:

- no admin changes are needed,
- a small compatibility update is needed,
- or the feature must be split across both repositories.

---

## Final Recommendation

Proceed with a CMS-driven, course-level shipping flag.

Do not model this as a fake physical SKU unless the admin panel or reporting layer forces that choice.

This repo already has most of the shipping infrastructure needed for checkout and order persistence. The real technical work is:

- exposing the new course rule,
- making cart and checkout honor it,
- validating it server-side,
- and confirming the separate admin panel can operationalize the resulting order.

If the admin repo cooperates cleanly, this should be a relatively contained feature with strong business value.