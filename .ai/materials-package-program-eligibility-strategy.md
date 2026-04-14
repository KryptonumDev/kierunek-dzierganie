# Materials Package Program Eligibility Strategy

## Context

This document translates the client email into a repository-specific implementation strategy for `kierunek-dzierganie`.

Business problem:

- A customer who owns a Program should be able to buy the materials package for a course included in that Program.
- At the same time, users who do **not** own the standalone course and do **not** own the Program should still be blocked from buying that package.
- The client wants to avoid an operational workflow where product relationships are constantly switched between course-level and Program-level references during launches.

The concrete example from the email is an **optional prerequisite**:

- a customer may buy a given materials package if they own the standalone course
- or if they own the Program that includes that course

The courses explicitly mentioned in the email are:

- `Twój Pierwszy Miś`
- `Szydełkowy Królik i Puchatek`
- `Żyrafka`
- `Koty Dwa`

This document is based on repository research across:

- `next/` for storefront, cart, checkout, payment, and fulfillment
- `sanity/` for content and product modeling
- `.ai/` for earlier architecture notes already checked into the repo

---

## Executive Summary

The repository already contains a prerequisite system for physical products such as materials packages, but it is built around a **single related course**.

Current state:

- Sanity stores course-to-product links on the `course` document through `materials_link`, `related_products`, and legacy `printed_manual`.
- The storefront product pages, cart, and checkout all derive a **single required course** from those links.
- The authoritative server-side enforcement happens in `next/src/app/api/payment/create/route.ts`.
- Ownership is checked in Supabase via `courses_progress`.
- A Program is not a separate entity in the data model. It is a `course` document with `type: 'program'`.

The main limitation is this:

- the current implementation does **not** model "customer can buy this product if they own **any of these course/program ids**"
- instead, it collapses the relationship to one course in several places

Because of that, the clean long-term solution is to add an explicit **OR-based purchase eligibility field on the `product` document** and use that field as the source of truth for checkout enforcement.

Recommended direction:

1. Add a new product-level field that stores all course/program documents that should qualify a user to buy that materials package.
2. Keep the server-side check in `payment/create/route.ts` as the authoritative guard.
3. Update cart and product-page UX to mirror the same rule, but do not rely on the UI as the only protection.
4. Keep fulfillment unchanged, because ownership is already modeled correctly through `courses_progress`.

This approach solves the client's problem without forcing editors to constantly move relationships back and forth between standalone courses and Programs.

---

## Repository Diagnosis

## High-Level Architecture

The repository is a Bun workspace with two main applications:

- `next/` - public storefront, account area, and API routes
- `sanity/` - CMS schemas and studio configuration

Operationally, the purchase flow spans four systems:

1. **Sanity**
   Stores catalog data, product references, course definitions, Program definitions, bundle definitions, and access-related metadata.

2. **Next.js**
   Builds product pages, cart state, checkout payloads, and payment API routes.

3. **Supabase**
   Stores `profiles`, `orders`, `courses_progress`, settings, and coupons.

4. **Przelewy24**
   Processes payments and triggers the fulfillment flow.

## Relevant Files

### Catalog and schema modeling

- `sanity/schemas/collectionTypes/Course_Collection.jsx`
- `sanity/schemas/collectionTypes/Product_Collection.jsx`
- `next/src/global/constants.ts`
- `next/src/global/types.ts`

### Product/cart eligibility UX

- `next/src/app/(main)/(produkty)/produkty/pakiety-materialow/[slug]/page.tsx`
- `next/src/components/_product/HeroPhysical/HeroPhysical.tsx`
- `next/src/components/ui/AddToCart/AddToCart.tsx`
- `next/src/components/ui/AddToCart/AddToCart.types.ts`
- `next/src/utils/useCartItems.ts`
- `next/src/components/_global/Header/_Cart.tsx`

### Checkout and authoritative validation

- `next/src/components/_global/Header/Checkout/Checkout.tsx`
- `next/src/app/api/payment/create/route.ts`

### Ownership and fulfillment

- `next/src/utils/course-access.ts`
- `next/src/utils/user-actions.ts`
- `next/src/components/_global/Header/_actions.ts`
- `next/src/app/api/payment/complete/update-items-quantity.ts`

### Existing internal architecture context

- `.ai/program-client-feature-strategy-plan.md`

---

## How the Current System Works

## 1. How courses, Programs, and materials packages are modeled

### Courses and Programs

In Sanity, a Program is stored as a `course` document:

- `type: 'course'`
- `type: 'program'`

This means there is no separate "program ownership" table or dedicated program entity in Supabase.

### Materials packages

Materials packages are stored as `product` documents with:

- `_type == 'product'`
- `basis == 'materials'`

### Existing course-to-product links

The existing product gating is inferred from links stored on the `course` schema:

- `materials_link`
- `related_products`
- `printed_manual` (legacy)

Important observation:

- the relationship is modeled **from course to product**
- there is no first-class product field that says "these are all the course/program ids that qualify a buyer for this product"

That is the main reason the current system becomes awkward when one product should be buyable by owners of either a standalone course or a Program.

## 2. How ownership is determined

The source of truth for ownership is:

- Supabase table `courses_progress`

The helper that normalizes active ownership is:

- `next/src/utils/course-access.ts`

The logic is:

- if there is no `access_expires_at`, access is active
- if there is an `access_expires_at`, access is active only until that date

So in practical terms:

- "owns standalone course" means there is an active `courses_progress.course_id == <course id>`
- "owns Program" means there is an active `courses_progress.course_id == <program id>`

The system already supports both, because Programs are also `course` documents.

## 3. Where the prerequisite is enforced today

### Product page UX

Product detail pages load `relatedCourses` via GROQ. For materials pages this happens in:

- `next/src/app/(main)/(produkty)/produkty/pakiety-materialow/[slug]/page.tsx`

That query currently derives related courses by asking:

- which `course` documents reference this `product` via `materials_link`
- or via `related_products`

### Add to cart

`HeroPhysical.tsx` passes only:

- `relatedCourses?.[0]`

to `AddToCart.tsx`.

`AddToCart.tsx` then checks only one related course:

- user already owns that course
- or that course is in the cart

If neither is true, add-to-cart is blocked.

### Cart cleanup

`useCartItems.ts` loads only one related course into:

- `related`

using:

- `...[0]{ _id, name }`

`_Cart.tsx` then removes invalid cart items if that one related course is neither owned nor in the cart.

### Checkout API

The authoritative enforcement is in:

- `next/src/app/api/payment/create/route.ts`

The route:

1. gathers `product` ids in the order
2. queries Sanity for `course` documents referencing those product ids
3. builds `productRequiredCourseMap`
4. verifies whether the buyer owns the related course or is buying it in the same order

This is the real security boundary.

## 4. Current limitation

The implementation collapses the prerequisite to one course in several places:

- `HeroPhysical.tsx` uses `relatedCourses?.[0]`
- `useCartItems.ts` resolves `related` with `[0]`
- `payment/create/route.ts` stores one entry per product in `productRequiredCourseMap`

That means the code is effectively assuming:

- one product
- one qualifying course

It is not naturally expressing:

- one product
- many acceptable qualifying documents
- OR semantics between them

## 5. Important inconsistency: legacy `printed_manual`

The repo contains a legacy field:

- `printed_manual`

It still appears in some client-side relation lookups, for example in `useCartItems.ts`, but the current server guard in `payment/create/route.ts` only maps:

- `materials_link`
- `related_products`

and does not clearly enforce `printed_manual` the same way.

This matters because any plan touching purchase eligibility should either:

- migrate away from `printed_manual`
- or explicitly support it in the new server logic during the transition

---

## The Real Requirement Behind the Email

The email is not asking for a new ownership model.

It is asking for a better **eligibility model**.

Specifically:

- materials package `X` should be purchasable when the user owns standalone course `A`
- and also purchasable when the user owns Program `P`
- without editors needing to rewire relations before and after each launch

The best mental model is therefore:

- **purchase eligibility is a rule on the product**
- not something inferred indirectly from whichever course currently happens to point at that product

That distinction is important.

---

## Solution Options

## Option A. Product-Level OR Eligibility Field

### Summary

Add a dedicated eligibility field on the `product` document that explicitly lists all `course` documents whose ownership should allow purchase.

Because Programs are stored as `course` documents too, the same field can contain:

- standalone courses
- Programs

without any special database model.

### Recommended field design

Suggested internal name:

- `purchaseRequiresAccessToAny`

Possible editor-facing label:

- `Produkt można kupić po posiadaniu jednego z poniższych kursów / programów`

Suggested schema type:

- array of references to `course`

Suggested semantics:

- if the array is empty, the product has no ownership prerequisite
- if the array contains one entry, behavior matches the current simple case
- if the array contains multiple entries, owning **any one** of them is sufficient

### Why this is the recommended option

It directly matches the business problem:

- the rule belongs to the materials package
- the rule is explicit in the CMS
- the rule supports course OR Program with no ambiguity
- editors no longer need to switch references back and forth

It also fixes a structural weakness in the current implementation:

- eligibility is no longer inferred from inverse references and then accidentally collapsed to one course

### Pros

- cleanest mental model for editors
- directly supports OR semantics
- easy to apply only to the affected materials packages
- no Supabase schema change required
- no change to fulfillment required
- Programs work automatically because they are already `course` documents

### Cons

- requires schema and frontend/API changes
- introduces a new operational field that editors must understand
- some migration/backward-compatibility logic is needed while old relations remain in use

## Option B. Keep Existing Course-to-Product Links, But Support Many Parents

### Summary

Do not add a new field. Instead:

- keep `materials_link` / `related_products`
- allow multiple `course` documents to reference the same `product`
- change code so the product becomes purchasable if the buyer owns **any** of the referencing courses/programs

### Why this is possible

The current schema already allows multiple `course` documents to point at the same `product`.

For example:

- standalone course `A` points to product `X`
- Program `P` also points to product `X`

Then the code could treat both as valid prerequisites.

### Why this is not the recommended option

This is less explicit and more fragile:

- the source of truth remains inverse and indirect
- editors must understand that eligibility is inferred from other documents
- merchandising links and purchase eligibility stay mixed together
- current UI and API code all assume "first match" or "one related course"

It can work, but it keeps the conceptual debt.

### Pros

- smaller schema change, possibly none
- can be closer to the current implementation

### Cons

- weaker editorial clarity
- more room for ambiguous or accidental relationships
- still requires code changes across product page, cart, and API
- still leaves legacy-field migration issues

## Option C. Use `grantedCourses` on the Program So Program Owners Also Own the Course

### Summary

The repo already supports `grantedCourses` on `course` documents, and checkout already includes those in the purchased course grant set.

That means a Program could theoretically grant the included standalone course ids. If that happened, the current course-based prerequisite check for materials packages would pass automatically.

### Why this is attractive

This is the smallest conceptual change if the business wants Program ownership to be functionally equivalent to owning all included courses.

### Why this is risky

This changes entitlement, not only purchase eligibility.

If a Program grants full standalone course access, users may also gain:

- separate course entries in their account
- course-level files
- lesson access outside the intended Program pacing
- duplicate or confusing content presentation

Because of that, this is only a good option if the business explicitly wants:

- Program purchase == full ownership of each included course

### Recommendation on this option

Treat this as a separate business decision, not as the default solution to the email request.

It may be useful for some launches, but it is not the safest general answer.

---

## Recommended Direction

The recommended implementation is:

- **Option A as the long-term solution**
- with a **short-term compatibility layer** so existing `materials_link`, `related_products`, and legacy `printed_manual` data do not break during rollout

This gives the client exactly what they asked for:

- course OR Program access
- no repeated relation switching
- explicit product-level configuration
- no new ownership system

---

## Detailed Implementation Strategy

## Phase 1. Introduce an Explicit Product Eligibility Field

### Files

- `sanity/schemas/collectionTypes/Product_Collection.jsx`

### Change

Add a new field on `product`:

- name: `purchaseRequiresAccessToAny`
- type: `array`
- items: references to `course`

Recommended behavior:

- visible mainly for `basis === 'materials'`
- optionally also visible for `basis === 'instruction'` if the same rule should later apply to printed manuals or similar gated products

Recommended description:

- explain that owning **any one** of the selected course/program documents allows purchase
- explain that Programs should be selected directly if Program ownership should count

### Why product-level

This makes the ownership rule local to the product being sold.

Editors no longer need to infer:

- "which course should point to this product right now?"

Instead they can configure:

- "who is allowed to buy this product?"

## Phase 2. Extend Product Queries and Types

### Files

- `next/src/global/constants.ts`
- `next/src/global/types.ts`
- `next/src/app/(main)/(produkty)/produkty/pakiety-materialow/[slug]/page.tsx`
- `next/src/app/(main)/(produkty)/produkty/instrukcje/[slug]/page.tsx`
- `next/src/app/(main)/(produkty)/produkty/inne/[slug]/page.tsx`
- `next/src/app/(main)/(produkty)/produkty/szydelkowanie/[slug]/page.tsx`

### Change

Add the new field to the product query/type layer, for example as:

- `purchaseRequiresAccessToAny[]->{ _id, name, type }`

Recommended app-level type shape:

- `purchaseEligibility?: Array<{ _id: string; name?: string; type?: 'course' | 'program' }>`

Important:

- stop thinking in terms of a single `relatedCourse`
- move to an array of qualifying course/program refs

### Compatibility recommendation

During rollout, the storefront can expose a normalized field that prefers:

1. `purchaseRequiresAccessToAny`
2. fallback to inferred relationships from `materials_link`, `related_products`, and `printed_manual`

This allows the app to ship before all CMS entries are migrated.

## Phase 3. Update Product Page and Add-to-Cart UX

### Files

- `next/src/components/_product/HeroPhysical/HeroPhysical.tsx`
- `next/src/components/ui/AddToCart/AddToCart.tsx`
- `next/src/components/ui/AddToCart/AddToCart.types.ts`

### Current problem

`HeroPhysical.tsx` currently passes only:

- `relatedCourses?.[0]`

to `AddToCart.tsx`.

`AddToCart.tsx` then checks only one required course.

### Change

Pass the full list of qualifying references, for example:

- `purchaseEligibility`

Then in `AddToCart.tsx` change the logic from:

- one required course

to:

- the user can add the product if they own **any** qualifying id
- or if they are adding **any** qualifying id in the same order

Conceptually:

- `ownsAnyEligibleCourse`
- `hasAnyEligibleCourseInCart`
- block only if both are false

### UX note

The user-facing message should be generalized.

Instead of:

- "you do not own course X"

it should say something like:

- "This product requires access to the related course or Program"

or, if helpful:

- list one or two acceptable names and then say "or another qualifying Program"

## Phase 4. Update Cart Revalidation Logic

### Files

- `next/src/utils/useCartItems.ts`
- `next/src/components/_global/Header/_Cart.tsx`

### Current problem

`useCartItems.ts` currently loads:

- `"related": *[...][0]{ _id, name }`

and `_Cart.tsx` removes the product if that one course is not owned or in the cart.

### Change

Replace the single `related` relationship with a normalized eligibility array.

Then update `_Cart.tsx` so cart cleanup behaves like:

- if product has purchase eligibility rules
- and none of the qualifying ids is owned
- and none of them is present in the same cart
- remove the item and show a message

This keeps the cart behavior aligned with the product-page behavior.

## Phase 5. Make `payment/create` the Final Authority for OR Eligibility

### Files

- `next/src/app/api/payment/create/route.ts`

### Current problem

The API builds:

- `productRequiredCourseMap`

as:

- product id -> one course

This is where the business rule actually needs to change.

### Recommended implementation

Replace the current single-value map with something like:

- product id -> array or set of acceptable qualifying course/program ids

Recommended behavior:

1. Collect product ids from the order.
2. Load explicit product-level eligibility from Sanity.
3. If the new field is empty for some product, optionally derive fallback eligibility from legacy relationships.
4. Build:
   - `productEligibilityMap: Map<string, Array<{ _id: string; name?: string }>>`
5. Collect:
   - `orderCourseIds`
6. For logged-in users, query `courses_progress` for all required ids and normalize with `getActiveOwnedCourseIds`.
7. For each product line:
   - allow if `orderCourseIds` intersects the product eligibility ids
   - allow if `ownedRelatedCourseIds` intersects the product eligibility ids
   - block otherwise

### Why this solves the email request

If a materials package lists:

- standalone course `A`
- Program `P`

then the server allows purchase when the user owns `A` or owns `P`.

### Why fulfillment does not need to change

This rule controls **who may buy the physical product**.

It does not change:

- course entitlement creation
- stock decrement
- email sending
- invoice generation

All of that can stay in the existing fulfillment flow.

## Phase 6. Preserve Backward Compatibility During Migration

### Why a transition layer is important

This repository already contains working relationships based on:

- `materials_link`
- `related_products`
- `printed_manual`

Replacing them all at once is operationally risky.

### Recommended transition

For a temporary period:

1. Prefer `purchaseRequiresAccessToAny` if it is configured.
2. Otherwise derive eligibility from legacy links.
3. Aggregate all matches, not just the first one.

This lets the team migrate product-by-product instead of doing a hard cutover.

### Legacy cleanup

The long-term goal should be:

- stop relying on `printed_manual` for enforcement
- move legacy product relationships into either:
  - `related_products` for merchandising
  - `purchaseRequiresAccessToAny` for eligibility

---

## Why This Is Better Than Constantly Rewiring Relations

The client's pain is operational:

- before Program sales, relations are changed
- after Program sales, relations are changed back
- orders still have to be manually reviewed

With the recommended model:

- the materials package is configured once
- the standalone course and the Program can both count
- the API enforces the rule consistently
- no temporary launch rewiring is needed

This is exactly the kind of case where a product-level OR rule is preferable to one-to-one relationships.

---

## Short-Term Launch Alternative

If the client needs a very fast, lower-scope launch fix, there is a temporary compromise:

- keep the current course-to-product relation model
- change the code so a product may be linked from multiple `course` documents
- treat any of those references as acceptable ownership

In practice this means:

- the standalone course and the Program can both reference the same materials package
- the code changes from "first match wins" to "any match qualifies"

This avoids introducing a new schema field immediately.

However, this should be viewed as a tactical shortcut, because:

- the source of truth remains indirect
- editorial intent remains less obvious
- merchandising and eligibility remain mixed together

If the team wants the cleanest maintainable solution, the product-level field is still the better destination.

---

## Why `grantedCourses` Is Not the Default Recommendation

This repo already includes `grantedCourses` on the `course` schema, and checkout already grants those course ids.

At first glance, it may seem tempting to solve the email by configuring the Program so it automatically grants the included courses.

That would make the current materials prerequisite pass automatically.

The problem is that this changes product access semantics in a much broader way.

If Program purchase starts granting standalone course ids, users may gain:

- separate course ownership records
- separate course visibility in their account
- access patterns that differ from the Program's release schedule

So this is only appropriate if the business explicitly wants:

- Program ownership to equal full standalone ownership of the included courses

If the real business requirement is only:

- "allow buying the materials package"

then changing the purchase eligibility rule is safer than changing the access model.

---

## Recommended CMS Configuration for the Specific Client Request

For each affected materials package, configure purchase eligibility to include:

1. the standalone course document
2. the Program document

For the courses listed in the email, the content setup should be conceptually equivalent to:

- package for `Twój Pierwszy Miś` -> eligible if user owns `Twój Pierwszy Miś` or the relevant Program
- package for `Szydełkowy Królik i Puchatek` -> eligible if user owns that course or the relevant Program
- package for `Żyrafka` -> eligible if user owns that course or the relevant Program
- package for `Koty Dwa` -> eligible if user owns that course or the relevant Program

This should be configured through references, not hardcoded in application code.

The code should not contain product-name-specific exceptions.

---

## QA Strategy

There does not appear to be a real automated test suite configured in this repo, so QA should be planned mainly as:

- focused manual testing
- optionally a small extracted helper with unit tests later if the team introduces test infrastructure

## Critical manual scenarios

1. Logged-in user owns the standalone course but not the Program.
   Result: materials package purchase is allowed.

2. Logged-in user owns the Program but not the standalone course.
   Result: materials package purchase is allowed.

3. Logged-in user owns neither the course nor the Program.
   Result: product is blocked in add-to-cart, removed from cart if present, and rejected by `payment/create`.

4. Logged-in user adds the standalone course and the materials package in the same order.
   Result: checkout is allowed.

5. Logged-in user adds the Program and the materials package in the same order.
   Result: checkout is allowed.

6. Guest user tries to buy the materials package alone.
   Result: order is rejected. If no account context exists, ownership cannot be verified.

7. Product has multiple qualifying refs.
   Result: the order succeeds if any one qualifying ref is owned or present in the order.

8. Product still uses legacy `printed_manual`.
   Result: confirm whether fallback logic or migration preserves expected blocking.

9. Existing materials packages unrelated to Programs.
   Result: current behavior still works when only one qualifying ref exists.

10. Mixed cart with unrelated products and one gated materials package.
    Result: only the invalid gated product is blocked.

## Additional regression checks

- standard standalone course purchases
- bundle purchases
- free or heavily discounted orders
- stock decrement for materials packages
- thank-you page and payment completion flow

---

## Rollout Plan

## Phase 1. Ship the code in backward-compatible mode

Implement:

- new schema field
- new query/type layer
- UI support for many qualifying ids
- server-side OR enforcement
- fallback to legacy inferred relationships

This allows the feature to be deployed before every affected product is migrated.

## Phase 2. Configure the affected materials packages in Sanity

For the launch-critical packages:

- add the standalone course ref
- add the Program ref

This solves the client's immediate problem without launch-time rewiring.

## Phase 3. Audit and reduce legacy dependency logic

After the urgent rollout:

- identify products still depending on `printed_manual`
- decide whether `materials_link` and `related_products` should remain only as merchandising relationships
- keep purchase enforcement centered on the new explicit field

---

## Open Product Decisions

These questions should be answered before implementation starts, because they affect the exact behavior:

1. Should the rule apply only to `basis === 'materials'`, or also to `instruction` and other gated physical products?

2. Should the product be purchasable if the user owns a qualifying **bundle** rather than a course/Program directly?
   Current architecture does not model bundle ownership as a first-class entitlement in the same way as `courses_progress`.

3. Is active access required, or is historical purchase enough?
   The current implementation uses active `courses_progress`, so expired access does not count.

4. Should guest checkout remain impossible for these products if they depend on prior ownership?
   Recommended answer: yes, because the existing guard is tied to authenticated ownership.

5. Does the business ever want Program purchase to grant full standalone course ownership?
   If yes, `grantedCourses` becomes a separate strategic topic.

---

## Final Recommendation

The best implementation for this repository is to treat purchase eligibility as an explicit product rule.

Specifically:

- add a product-level array of qualifying `course` references
- store both the standalone course and the Program there when either should allow purchase
- update cart and product-page UX to respect the OR rule
- keep `payment/create/route.ts` as the final authority
- keep Supabase ownership and fulfillment unchanged

This solves the client request with the least operational friction and the clearest long-term content model.

If the team needs a faster launch-oriented patch, supporting multiple parent `course` references without a new field is a workable temporary alternative, but it should be treated as a stopgap rather than the final architecture.
