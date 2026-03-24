# Program Client Feature Strategy Plan

## Context

This plan is based on the client email thread and a repository-wide diagnosis of the current `kierunek-dzierganie` codebase.

The client asked for six improvements around Programs, post-purchase offers, downloadable files, and video defaults:

1. Automatically grant bonus courses when a Program is purchased.
2. Preview the post-purchase offer without making a test purchase.
3. Make the post-purchase discount optional.
4. Hide lesson download files in the global downloads view when the related module is still locked.
5. Allow files to be attached to the Program as a whole, not only to specific lessons.
6. Default new lessons to Bunny.net as the video provider.

The most important item for the client is point 1.

---

## Executive Summary

From a business perspective, the client is asking for three different kinds of improvements:

1. **Operational automation**
   Point 1 removes a daily manual CSV-based enrollment task.

2. **Editor autonomy**
   Points 2, 3, 5, and 6 reduce the need for workarounds in Sanity and make the CMS more practical for non-technical staff.

3. **Access consistency**
   Point 4 closes a content leakage gap between locked Program modules and the downloads area.

The most important architectural finding is this:

- **Sanity is not the source of truth for access.**
- Product and lesson structure live in Sanity.
- User access is granted in Supabase by inserting rows into `courses_progress`.
- Those inserts currently happen inside the payment fulfillment flow, mainly in `next/src/app/api/payment/complete/update-items-quantity.ts`.

This means:

- Point 1 cannot be solved by content-only CMS fields unless the checkout and fulfillment code reads those fields and turns them into extra granted course IDs.
- Points 2 and 3 are not greenfield. A post-purchase offer system already exists and needs to be extended.
- Point 5 is almost already supported in the frontend, but blocked in Sanity by schema visibility rules.
- Point 6 is a very small CMS change.

---

## Repository Diagnosis

### Architecture

- `next/` is the public web app and API layer.
- `sanity/` is the CMS schema and Studio configuration.
- Supabase stores users, orders, coupons, and course access state.
- Przelewy24 handles payments.
- Bunny.net is already supported as a video provider.

### How course access currently works

The current purchase-to-access flow is:

1. Checkout builds `products.array` from cart data.
2. Each order line may include a `courses` array.
3. After payment, `update-items-quantity.ts` inserts one `courses_progress` row per course in that array.

Important files:

- `next/src/components/_global/Header/Checkout/Checkout.tsx`
- `next/src/utils/useCartItems.ts`
- `next/src/global/constants.ts`
- `next/src/app/api/payment/create/route.ts`
- `next/src/app/api/payment/complete/update-items-quantity.ts`

### How Programs are modeled

There is no separate `program` document type.

- A Program is a `course` document with `type: 'program'`.
- Chapter unlock dates are already modeled in Sanity with `dateOfUnlock`.

Important files:

- `sanity/schemas/collectionTypes/Course_Collection.jsx`
- `sanity/schemas/components/ChaptersList.js`

### What already exists for post-purchase offers

The repo already has:

- a `postPurchaseOffer` field on `course` and `bundle`
- a thank-you page at `/dziekujemy/[orderId]`
- redirect logic after payment
- coupon generation for the offer

Important files:

- `sanity/schemas/collectionTypes/Course_Collection.jsx`
- `sanity/schemas/collectionTypes/Bundle_Collection.jsx`
- `next/src/utils/resolve-post-purchase-offer.ts`
- `next/src/app/api/payment/verify/route.ts`
- `next/src/app/(main)/dziekujemy/[orderId]/page.tsx`
- `next/src/components/_postPurchase/PostPurchaseHero/_OfferSection.tsx`

### Separate admin panel risk

Existing `.ai` documentation in this repo confirms that a separate admin panel exists in another codebase and connects to the production database.

That matters mainly when we introduce database schema changes.

For the strategy below, the recommended approach avoids DB schema changes for all six items, so the admin panel codebase is **not required to define the implementation plan**.

It becomes relevant only if we later decide to:

- add new DB columns
- expose new operational controls in the admin panel
- change reporting or fulfillment behavior outside this repo

---

## Delivery Recommendation

Recommended rollout order:

1. **Point 1 first**
   This delivers the biggest business win because it removes a daily manual process before the Program sale.

2. **Points 5 and 6 next**
   They are low-risk CMS improvements and can be bundled with point 1 if desired.

3. **Points 2 and 3 after that**
   They extend an already existing post-purchase system and should be treated as one workstream.

4. **Point 4 last, but before the next Program launch**
   It is the only item that affects access consistency and requires careful QA around locked content.

Suggested packaging:

- **Package A: enrollment automation**
  Points 1, 5, 6

- **Package B: upsell/editor workflow**
  Points 2, 3

- **Package C: locked content consistency**
  Point 4

---

## Point 1: Automatic Bonus Course Assignment

### Business Goal

When a customer buys a Program, they should automatically receive the bonus courses that belong to that Program, without any daily manual CSV export/import work.

This is the highest-value item because it removes repetitive operational work, reduces human error, and makes the launch scalable.

### Current Diagnosis

Today, course access is granted only from the `courses` array attached to order line items.

Current behavior:

- Buying a single `course` grants only that course.
- Buying a `bundle` grants the courses listed in the bundle's `courses[]` references.
- There is no separate concept of bonus courses that are auto-granted by purchasing a Program course.
- The existing Sanity `Bonuses` component is marketing content only. It does not grant access.

### Recommended Product Decision

Do **not** solve this with a manual admin workflow or with a standalone job.

The cleanest business and technical model is:

- Add a new CMS field on `course` documents for **granted bonus courses**.
- At checkout, turn a purchased Program into a list of granted course IDs:
  the Program itself plus its bonus courses.
- Reuse the existing fulfillment pipeline so payment completion remains the single source of truth.

This keeps the feature understandable:

- editors configure it in Sanity
- checkout persists the access intent in the order
- fulfillment grants access exactly once

### Recommended Scope

Add a new operational field to `course`:

- `grantedCourses` or `bonusCourses`

Recommended semantics:

- only available on `course` documents
- visible mainly when `type === 'program'`
- references other `course` documents
- stores courses that should be granted together with the purchase

I recommend `grantedCourses` as the internal field name, because it describes behavior more clearly than `bonusCourses`.

### Implementation Strategy

#### Step 1. Add a new operational CMS field

Update `sanity/schemas/collectionTypes/Course_Collection.jsx`:

1. Add a field such as `grantedCourses`.
2. Make it an array of references to `course`.
3. Add editor help text explaining that these are access grants, not just marketing bonuses.
4. Optionally hide or collapse it for non-Program courses.

#### Step 2. Include granted courses in cart product data

Update the cart product query so the checkout layer receives the full grant set.

Likely files:

- `next/src/global/constants.ts`
- `next/src/utils/useCartItems.ts`

Target behavior:

- for a single `course`, cart data should contain:
  purchased course ID + any `grantedCourses`
- for a `bundle`, keep current behavior through `courses[]`

#### Step 3. Normalize checkout payload construction

Update `next/src/components/_global/Header/Checkout/Checkout.tsx`.

Today it does:

- `course` => `[ { _id: item._id } ]`
- `bundle` => `item.courses`

Change that to:

- `course` => `[self, ...grantedCourses]`
- `bundle` => `item.courses`

Also de-duplicate IDs in case editors accidentally include the purchased course itself in `grantedCourses`.

#### Step 4. Keep fulfillment logic centralized

Keep `next/src/app/api/payment/complete/update-items-quantity.ts` as the grant executor.

It already:

- checks if a `courses_progress` row exists
- skips duplicates
- inserts only missing course rows

That means point 1 can be implemented without changing the DB structure.

#### Step 5. Verify free-order parity

`next/src/app/api/payment/create/route.ts` already grants access immediately for zero-value orders.

We must verify the exact same `courses` array is preserved there, so bonus courses are granted consistently for:

- paid Program orders
- fully discounted Program orders

#### Step 6. Add QA coverage

Manual QA cases:

1. Buy a Program with 3 configured bonus courses.
2. Confirm 4 total `courses_progress` rows exist for that user.
3. Buy the same Program again.
4. Confirm no duplicate rows are created.
5. Buy with a 100% coupon.
6. Confirm the same access is granted.

### Likely Files

- `sanity/schemas/collectionTypes/Course_Collection.jsx`
- `next/src/global/constants.ts`
- `next/src/utils/useCartItems.ts`
- `next/src/components/_global/Header/Checkout/Checkout.tsx`
- `next/src/app/api/payment/create/route.ts`
- `next/src/app/api/payment/complete/update-items-quantity.ts`

### Business Risks

- If editors confuse marketing bonuses with granted courses, expectations will drift.
- If refunds should revoke bonus access, there is no visible revocation flow in this repo today.
- If the separate admin panel manually grants access elsewhere, we should make sure the naming matches to avoid operational confusion.

### Recommendation

This should be implemented **inside this repo**, not in the separate admin panel, because the existing purchase fulfillment already lives here and can handle it cleanly without database changes.

---

## Point 2: Preview the Post-Purchase Offer Without a Test Purchase

### Business Goal

Editors should be able to validate the thank-you page and offer presentation before publishing, without creating fake orders or making test purchases.

This reduces CMS friction and lowers the cost of experimenting with offers.

### Current Diagnosis

A real post-purchase offer flow already exists, but it is coupled to:

- a real order ID
- a real logged-in user
- the `/dziekujemy/[orderId]` route

There is no CMS preview route for the offer configuration itself.

Sanity preview currently points product-like documents to their public product pages, not to a synthetic post-purchase offer page.

### Recommended Product Decision

Do not require editors to create fake orders.

Instead, add a **preview-only offer route** that renders the same UI using draft Sanity data and synthetic order data.

### Implementation Strategy

#### Step 1. Create a preview-only route in Next

Add a route such as:

- `/podglad/oferta-po-zakupie/[documentId]`

or

- `/api/post-purchase-offer/preview?documentId=...`

Recommended behavior:

1. Load the `postPurchaseOffer` config directly from Sanity by document ID.
2. Use draft-aware fetching in preview mode.
3. Do **not** create a coupon in Supabase.
4. Return or render a synthetic payload matching the real UI contract.

#### Step 2. Reuse the same UI component

Reuse `PostPurchaseHero`, but add a preview mode.

Preview mode should:

- use a fake order identifier
- generate a synthetic coupon only for display if discount exists
- optionally simulate an expiration timer
- never write to the database

#### Step 3. Add a Studio entry point

Update the Sanity editor experience so the preview is easy to open.

Good options:

1. Add a custom document action or button in `course` and `bundle`.
2. Extend `deskStructure.jsx` with a dedicated preview view for post-purchase offers.

The key business requirement is speed:

- editors should reach the preview in one click
- the preview should work before publishing

#### Step 4. Secure preview access

The preview route should not be publicly exploitable.

Recommended protection:

- preview secret
- draft mode
- Studio-authenticated access pattern already used in this project

### Likely Files

- `sanity/deskStructure.jsx`
- `sanity/schemas/collectionTypes/Course_Collection.jsx`
- `sanity/schemas/collectionTypes/Bundle_Collection.jsx`
- `next/src/utils/resolve-post-purchase-offer.ts`
- `next/src/app/(main)/dziekujemy/[orderId]/page.tsx`
- `next/src/components/_postPurchase/PostPurchaseHero/PostPurchaseHero.tsx`
- new preview route in `next/src/app/...`

### Business Risks

- If preview uses real coupon creation, editors will pollute production data.
- If preview does not support drafts, the editor workflow will still be frustrating.

### Recommendation

Treat this as an **editor tooling improvement**, not as a checkout feature.

---

## Point 3: Make the Post-Purchase Discount Optional

### Business Goal

The post-purchase offer should support both:

- discounted upsells
- non-discounted curated recommendations

This gives the client more merchandising flexibility and avoids forcing a margin reduction every time they want to use the post-purchase page.

### Current Diagnosis

The current system assumes that every active post-purchase offer has:

- a required `discountAmount`
- a generated coupon
- crossed-out original pricing
- a coupon copy block in the UI

This is enforced in both Sanity and the app.

### Recommended Product Decision

Do not implement this as a silent nullable number only.

For editor clarity, the better product model is:

- add an explicit **offer mode**

Recommended modes:

- `discounted`
- `standard`

Behavior:

- `discounted` => requires `discountAmount`, may generate coupon
- `standard` => no discount, no coupon, no crossed-out pricing

This prevents accidental no-discount configurations caused by editors forgetting to fill a number.

### Implementation Strategy

#### Step 1. Update the CMS schema

In both:

- `sanity/schemas/collectionTypes/Course_Collection.jsx`
- `sanity/schemas/collectionTypes/Bundle_Collection.jsx`

Add an explicit mode field and update validation rules:

1. `offerMode = 'discounted' | 'standard'`
2. Require `discountAmount` only when mode is `discounted`
3. Hide coupon-related copy if mode is `standard`

#### Step 2. Update offer resolution logic

Update `next/src/utils/resolve-post-purchase-offer.ts`.

New behavior:

1. If mode is `discounted`, keep current coupon generation logic.
2. If mode is `standard`, return offer data with:
   - no coupon creation
   - no coupon code
   - no discount amount

#### Step 3. Update the UI

Update `next/src/components/_postPurchase/PostPurchaseHero/_OfferSection.tsx`.

UI rules:

- if discounted:
  show original price, discounted price, and coupon block
- if standard:
  show product cards and CTA only
- timer should remain optional and independent of discount

#### Step 4. Update preview logic from point 2

Preview must support both offer modes, otherwise editors still cannot validate the real result.

### Likely Files

- `sanity/schemas/collectionTypes/Course_Collection.jsx`
- `sanity/schemas/collectionTypes/Bundle_Collection.jsx`
- `next/src/utils/resolve-post-purchase-offer.ts`
- `next/src/components/_postPurchase/PostPurchaseHero/PostPurchaseHero.tsx`
- `next/src/components/_postPurchase/PostPurchaseHero/_OfferSection.tsx`

### Business Risks

- If this is modeled only as `discountAmount = null`, editors may accidentally publish the wrong state.
- If offer mode is added but reporting later assumes all offers create coupons, analytics may need a follow-up adjustment.

### Recommendation

Ship point 3 together with point 2, because both depend on the same post-purchase offer model and UI.

---

## Point 4: Hide Lesson Files for Locked Program Modules

### Business Goal

If a Program module has not unlocked yet, files attached to lessons in that module should not appear in the global downloads area.

This is important because otherwise the user can receive locked content early through the downloads screen even if the Program timeline is supposed to pace access.

### Current Diagnosis

The current `/moje-konto/pliki-do-pobrania` implementation:

- loads all owned courses
- walks through all lessons in all chapters
- aggregates lesson files
- does **not** filter by chapter unlock date

Important detail:

- Program unlock timing is already modeled in Sanity through `chapter.dateOfUnlock`.
- The downloads page ignores that state.

There is also a second important risk:

- the lesson route does not visibly enforce a direct hard block for a lesson inside a future chapter
- the main gating appears stronger in the chapter UI than in the lesson URL layer

That means the safest implementation is not only "hide from downloads", but also "verify direct lesson access rules."

### Recommended Product Decision

Filter lesson files by unlocked chapters for Programs.

Recommended rule:

- if `course.type !== 'program'`, current behavior stays unchanged
- if `course.type === 'program'`, include lesson files only from chapters where `dateOfUnlock` is not in the future

### Implementation Strategy

#### Step 1. Extend the files page query

Update `next/src/app/(main)/moje-konto/(authorized)/pliki-do-pobrania/page.tsx`.

Make sure the query returns:

- `course.type`
- `chapter.dateOfUnlock`

#### Step 2. Filter at aggregation time

Update `next/src/components/_dashboard/ListingFiles/ListingFiles.tsx`.

Before pushing lesson files into the aggregated list:

1. detect if the course is a Program
2. check whether the chapter is unlocked
3. skip files from locked chapters

#### Step 3. Verify lesson route hard gating

Review and likely tighten:

- `next/src/app/(main)/moje-konto/(authorized-non-layout)/kursy/[courseSlug]/[lessonSlug]/page.tsx`

Goal:

- if the lesson belongs to a future chapter in a Program, direct URL access should be blocked

This is not strictly required by the client wording, but it is strongly recommended to keep the business rule coherent.

#### Step 4. Decide how program-level files behave

Point 4 mentions files located in Program lessons.

So the default interpretation should be:

- hide lesson files for locked Program modules
- keep Program-level files visible unless the client explicitly wants them hidden too

This should be confirmed during implementation kickoff.

### Likely Files

- `next/src/app/(main)/moje-konto/(authorized)/pliki-do-pobrania/page.tsx`
- `next/src/components/_dashboard/ListingFiles/ListingFiles.tsx`
- `next/src/app/(main)/moje-konto/(authorized-non-layout)/kursy/[courseSlug]/[lessonSlug]/page.tsx`
- possibly `next/src/components/_dashboard/LessonHero/LessonHero.tsx`

### Business Risks

- If we only hide the files list but still allow direct lesson URLs, the content leak remains.
- If we hide too much, users may lose access to Program-level files that the client still wants available from day one.

### Recommendation

Treat point 4 as a **content-access consistency fix**, not as a cosmetic dashboard tweak.

---

## Point 5: Allow Files on the Program as a Whole

### Business Goal

Editors should be able to attach files once at the Program level instead of duplicating them lesson by lesson.

This reduces editorial work and avoids inconsistent file attachment across lessons.

### Current Diagnosis

This feature is almost already present in the app:

- `course.files` and `course.files_alter` already exist
- the Program/Course page already renders `RelatedFiles`
- `RelatedFiles` reads `course.files` and `course.files_alter`

The actual blocker is in Sanity:

- those fields are hidden when `document.type === 'program'`

So the frontend can already show Program-level files, but editors cannot configure them for Programs.

### Recommended Product Decision

This should be treated as a CMS unblock, not as a backend feature.

There is one follow-up product decision to make:

- Should Program-level files also appear in the global downloads page?

I recommend **yes**, because otherwise editors will add Program-level files and users will see them only on the Program page, not in `/pliki-do-pobrania`.

### Implementation Strategy

#### Step 1. Unhide Program-level files in Sanity

Update `sanity/schemas/collectionTypes/Course_Collection.jsx`.

Remove or change:

- `hidden: ({ document }) => document.type === 'program'`

for:

- `files`
- `files_alter`

Also update the field labels/help text to make it explicit that these files apply to the entire Program.

#### Step 2. Keep existing Program page behavior

No major frontend change is required for the Program page itself because `RelatedFiles` already renders course-level files.

Relevant files:

- `next/src/app/(main)/moje-konto/(authorized-non-layout)/kursy/[courseSlug]/page.tsx`
- `next/src/components/_dashboard/RelatedFiles/RelatedFiles.tsx`

#### Step 3. Decide whether to extend the global downloads page

Recommended implementation:

1. extend the files-page query to return course-level files
2. update `ListingFiles.tsx` to include them
3. clearly separate:
   - Program files
   - lesson files
   - user notes/certificate

### Likely Files

- `sanity/schemas/collectionTypes/Course_Collection.jsx`
- `next/src/app/(main)/moje-konto/(authorized-non-layout)/kursy/[courseSlug]/page.tsx`
- `next/src/components/_dashboard/RelatedFiles/RelatedFiles.tsx`
- optionally:
  - `next/src/app/(main)/moje-konto/(authorized)/pliki-do-pobrania/page.tsx`
  - `next/src/components/_dashboard/ListingFiles/ListingFiles.tsx`

### Business Risks

- If Program-level files become available in Sanity but are not added to the global downloads page, editors may think the feature is broken.

### Recommendation

Point 5 is a **quick win** and should be bundled with point 1 or point 6.

---

## Point 6: Default New Lessons to Bunny.net

### Business Goal

Since the client now uses Bunny.net as the standard video platform, new lesson creation should default to Bunny.net to remove repetitive editor choices and reduce accidental Vimeo usage.

### Current Diagnosis

Current defaults are still Vimeo:

- `Lesson_Collection.js` uses `initialValue: 'vimeo'`
- the course and bundle schemas also still default to Vimeo
- the app itself defaults to Vimeo when the provider is missing, which is good for legacy safety

### Recommended Product Decision

Change the **CMS default only**.

Do not change the runtime fallback for old records unless there is a specific migration plan.

That gives the client the new editorial default without breaking existing content.

### Implementation Strategy

#### Step 1. Update lesson schema default

Change `sanity/schemas/collectionTypes/Lesson_Collection.js`:

- `initialValue: 'vimeo'` -> `initialValue: 'bunnyNet'`

#### Step 2. Update editor description

Change the help text so it no longer says that no selection means Vimeo in the new-lesson workflow.

#### Step 3. Decide whether to align other schemas

Optional but recommended consistency review:

- `sanity/schemas/collectionTypes/Course_Collection.jsx`
- `sanity/schemas/collectionTypes/Bundle_Collection.jsx`
- any physical product schema that also exposes `videoProvider`

If editors use those fields in similar workflows, changing them too may reduce confusion.

#### Step 4. Keep runtime backward compatibility

Do not remove current fallback logic in:

- `next/src/components/ui/VideoPlayer/VideoPlayer.tsx`
- GROQ `select()` mappings that default to Vimeo

Those fallbacks still protect legacy documents with missing values.

### Likely Files

- `sanity/schemas/collectionTypes/Lesson_Collection.js`
- optionally:
  - `sanity/schemas/collectionTypes/Course_Collection.jsx`
  - `sanity/schemas/collectionTypes/Bundle_Collection.jsx`

### Business Risks

- Very low risk.
- The only real risk is editor confusion if lesson default changes but other document types still default to Vimeo.

### Recommendation

This is a **small CMS-only improvement** and should be included in the same release as other schema updates.

---

## Cross-Feature Dependencies

### Can this be done fully in this repo?

Yes, based on the current diagnosis, all six items can be planned and likely implemented primarily in this repo.

### Do we need the separate admin panel codebase right now?

Not for the current strategy.

I would ask for the admin panel codebase only if:

1. we decide to add database fields or tables
2. we need admin-side visibility or manual overrides for granted bonus courses
3. the admin panel already has order fulfillment logic that overlaps with this repo

### Do we need a database migration?

Recommended answer: **no**, not for the plan above.

All six items can be approached using:

- Sanity schema changes
- existing Next routes and components
- existing `orders` and `courses_progress` structures

Avoiding a DB migration is valuable because it reduces the risk of breaking the separate admin panel.

---

## Recommended Delivery Sequence

### Phase 1: Highest-priority operational fix

1. Implement point 1.
2. Bundle point 5 if the client wants Program-level files immediately.
3. Bundle point 6 because it is tiny and shares the same Sanity deployment cycle.

### Phase 2: Post-purchase offer maturity

1. Implement point 3 with explicit offer modes.
2. Implement point 2 using the same revised offer model.

### Phase 3: Access consistency

1. Implement point 4.
2. Add direct-lesson gating review as part of QA.

---

## Final Recommendation

If the client wants the most valuable version of this work with the lowest delivery risk, the best next move is:

1. **Ship point 1 first** using a new Program-level grant field in Sanity and the existing fulfillment pipeline.
2. **Ship points 5 and 6 in the same release** because they are cheap and CMS-centric.
3. **Treat points 2 and 3 as one upsell refinement project** because the core infrastructure already exists.
4. **Treat point 4 as an access-policy fix** and verify direct lesson gating while implementing it.

This gives the client immediate operational relief, avoids unnecessary database changes, and keeps the implementation aligned with how the current platform already works.
