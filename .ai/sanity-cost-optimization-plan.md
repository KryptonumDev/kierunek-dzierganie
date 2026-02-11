# Sanity Cost Optimization Plan

> **Created:** February 11, 2026
> **Context:** January 2026 Sanity invoice was $305 (5.2M API requests, 471 GB bandwidth). November 2025 baseline was 724K requests. Goal is to bring costs as close to $0 as possible.
> **Root causes:** All product/course pages are fully dynamic (SSR on every request) due to server-side auth checks + cookies. Combined with aggressive AI bot crawling (confirmed by Vercel team), `useCdn: false`, and uncached queries — every page view triggers 4-6 expensive Sanity API calls to the uncached backend.

---

## Table of Contents

1. [Current Architecture Problem](#1-current-architecture-problem)
2. [Phase 1: Separate Static Content from Dynamic User Data](#2-phase-1-separate-static-content-from-dynamic-user-data)
3. [Phase 2: Enable Sanity API CDN](#3-phase-2-enable-sanity-api-cdn)
4. [Phase 3: Cache Currently Uncached Queries](#4-phase-3-cache-currently-uncached-queries)
5. [Phase 4: Improve Revalidation Efficiency](#5-phase-4-improve-revalidation-efficiency)
6. [Projected Impact Summary](#6-projected-impact-summary)

---

## 1. Current Architecture Problem

### Why every page is dynamic right now

Even though product and course pages have `generateStaticParams`, they are **fully SSR'd on every request** because of three layers of dynamic behavior:

**Layer 1 — Layout directive (redundant but present):**
- `app/(main)/(produkty)/layout.tsx` → `export const dynamic = 'force-dynamic'`
- `app/(main)/(kursy)/layout.tsx` → `export const dynamic = 'force-dynamic'`

**Layer 2 — Header component in `app/(main)/layout.tsx` (affects ALL main pages):**
- `Header.tsx` calls `createClient()` which internally calls `cookies()` (dynamic function)
- Then calls `supabase.auth.getUser()` to get user session
- Then queries user profile, courses progress, virtual wallet balance, delivery settings
- Because the Header is a **server component** rendered in the parent layout, it forces the entire route tree dynamic

**Layer 3 — Product/course pages themselves:**
- Every `[slug]/page.tsx` calls `createClient()` + `supabase.auth.getUser()` to check if user owns the course (shows "already purchased" badge)
- Listing pages read `searchParams` for pagination/filtering
- Lesson preview pages read `cookies()` directly for MailerLite subscription check

**Result:** Removing `force-dynamic` alone changes nothing — the pages would still be dynamic due to `cookies()` calls in the Header and in each page component.

### What this means for Sanity costs

Every page request (real user or bot) triggers:
1. Full SSR of the page
2. The Header's Sanity query (`['global', 'Cart', 'course', 'product']` tags)
3. The Footer's Sanity query (`['global']` tag)
4. The page's own Sanity query (product/course data with reviews, materials, variants)
5. The page's metadata Sanity query
6. Potentially more queries for related products, materials packages, etc.

With `useCdn: false`, every single one of these goes to `api.sanity.io` (uncached backend). The Next.js Data Cache may catch some of them (if they have tags), but any cache miss or post-revalidation request goes straight to the Sanity backend.

---

## 2. Phase 1: Separate Static Content from Dynamic User Data

**Impact: ~50-60% API request reduction**
**Effort: High (largest refactor)**
**Risk: Medium — changes page rendering behavior**

### Scope boundary: public pages only

The website has two distinct views:

1. **Public-facing pages** (shop, products, courses, blog, landing pages, contact, etc.) — visited by everyone, crawled by bots, and responsible for ~99% of the Sanity API costs. **This is what we optimize.**
2. **Logged-in client area** (`/moje-konto/...` — orders, course dashboard, downloads, affiliate, wallet, etc.) — only accessed by authenticated users, already blocked from bots via `robots.txt`, and already correctly scoped with its own `force-dynamic` layout. **We do NOT touch this.**

This boundary significantly reduces scope and risk. The `/moje-konto/` area is complex, deeply user-specific, and works fine as dynamic. There's no cost benefit in changing it because bots never reach it and authenticated user traffic is a tiny fraction of overall requests.

### The core idea

Split every **public** product/course page into two concerns:
- **Static shell:** Product name, description, price, images, reviews, materials, course program — fetched from Sanity at build time or ISR, cached aggressively
- **Dynamic overlay:** "Already purchased" badge, user-specific pricing, owned courses check — fetched client-side after the page loads

This way, when a bot (or a non-logged-in user) visits a product page, they get the **cached static version** with zero Sanity API calls. Only logged-in users trigger the lightweight dynamic data fetch.

### Step 1.1: Remove `force-dynamic` from product and course layouts

**Files:**
- `next/src/app/(main)/(produkty)/layout.tsx` — remove `export const dynamic = 'force-dynamic'`
- `next/src/app/(main)/(kursy)/layout.tsx` — remove `export const dynamic = 'force-dynamic'`

**Not touched:**
- `next/src/app/(main)/moje-konto/layout.tsx` — stays `force-dynamic` (correct for logged-in area)

This is necessary but not sufficient on its own (see next steps).

### Step 1.2: Refactor the Header to not block static generation

The Header in `app/(main)/layout.tsx` is the biggest blocker. It's a server component that reads cookies and fetches user data. Because it's in the root `(main)` layout, it forces every page under it dynamic — including public pages that should be static.

**Strategy: Split Header into static shell + client-side user data**

1. Keep the Header's Sanity query (navigation data, cart highlights) as a **static server component** with cache tags
2. Move all user-specific data (profile, courses progress, virtual wallet, delivery settings) into a **client component** that hydrates after page load
3. The static Header renders the navigation, logo, and cart icon. The client-side part fills in user name, avatar, wallet balance, etc.

Note: This change affects the Header globally (both public and logged-in pages share it), but it's a net positive everywhere — the logged-in pages remain dynamic due to their own `force-dynamic` layout and page-level auth checks, while the public pages become free to be static.

### Step 1.3: Refactor public product/course `[slug]/page.tsx` files to move auth checks client-side

**Current pattern (in every public product/course detail page):**
```
const supabase = createClient();        // reads cookies → forces dynamic
const { data: { user } } = await supabase.auth.getUser();
// ... query user profile and owned courses
// ... pass ownedCourses to components
```

**New pattern:**
1. Remove `createClient()` and `auth.getUser()` from the server component
2. The page becomes a static server component — Sanity data is fetched with tags and cached
3. Create a `<UserOwnershipCheck productId={id} />` client component that:
   - Calls a lightweight API route or server action to check ownership
   - Renders the "already purchased" badge if owned
   - Falls back to nothing (no badge) for non-logged-in users

**Files to refactor (public `[slug]/page.tsx` only):**
- `app/(main)/(produkty)/produkty/dzierganie/[slug]/page.tsx`
- `app/(main)/(produkty)/produkty/szydelkowanie/[slug]/page.tsx`
- `app/(main)/(produkty)/produkty/instrukcje/[slug]/page.tsx`
- `app/(main)/(produkty)/produkty/pakiety-materialow/[slug]/page.tsx`
- `app/(main)/(produkty)/produkty/inne/[slug]/page.tsx`
- `app/(main)/(kursy)/kursy-dziergania-na-drutach/[slug]/page.tsx`
- `app/(main)/(kursy)/kursy-szydelkowania/[slug]/page.tsx`

**NOT touched (logged-in area pages keep their auth checks as-is):**
- `app/(main)/moje-konto/(authorized)/kursy/page.tsx`
- `app/(main)/moje-konto/(authorized)/zakupy/page.tsx`
- `app/(main)/moje-konto/(authorized)/pliki-do-pobrania/page.tsx`
- `app/(main)/moje-konto/(authorized)/program-lojalnosciowy/page.tsx`
- `app/(main)/moje-konto/(authorized-non-layout)/kursy/[courseSlug]/[lessonSlug]/page.tsx`
- And any other pages under `/moje-konto/`

### Step 1.4: Handle listing pages with `searchParams`

Public listing pages (`/produkty/dzierganie/page.tsx`, etc.) use `searchParams` for pagination and filtering, which inherently makes them dynamic.

**Strategy:** Accept these as dynamic — they represent a small fraction of total pages and bot traffic rarely hits paginated URLs. The detail pages (`[slug]`) are the main cost driver, not the listing pages.

### Step 1.5: Handle lesson preview pages with cookie checks

Lesson preview pages read `cookies().get(course.previewGroupMailerLite)` to check if user subscribed via MailerLite. Move this check client-side:

1. Render the lesson content statically
2. Use a client component to check the MailerLite cookie and conditionally show/hide the subscription gate

**Files:**
- `app/(main)/(kursy)/kursy-dziergania-na-drutach/[slug]/[lesson]/page.tsx`
- `app/(main)/(kursy)/kursy-szydelkowania/[slug]/[lesson]/page.tsx`

### Step 1.6: Add tags to `generateStaticParams` queries

Currently, all `generateStaticParams` functions call `sanityFetch` without tags, which means `cache: 'no-cache'` in production:

```typescript
// Current (no tags = uncached)
export async function generateStaticParams() {
  const data = await sanityFetch({
    query: `*[(_type == "product") && basis == 'knitting'] { 'slug': slug.current }`,
  });
  return data.map(({ slug }) => ({ slug }));
}
```

**Fix:** Add appropriate tags:
```typescript
// Fixed (cached with tags)
export async function generateStaticParams() {
  const data = await sanityFetch({
    query: `*[(_type == "product") && basis == 'knitting'] { 'slug': slug.current }`,
    tags: ['product'],
  });
  return data.map(({ slug }) => ({ slug }));
}
```

**Files (all `generateStaticParams` in public pages):**
- All 5 product `[slug]/page.tsx` files — add `tags: ['product']` (or `['product', 'voucher']`)
- All 2 course `[slug]/page.tsx` files — add `tags: ['course', 'bundle']`
- All 2 lesson `[slug]/[lesson]/page.tsx` files — add `tags: ['course']`
- Blog post `[slug]/page.tsx` — add `tags: ['BlogPost_Collection']`
- Blog category pages — add `tags: ['BlogCategory_Collection']`
- Landing pages — add `tags: ['landingPage']`
- Customer case studies — add `tags: ['CustomerCaseStudy_Collection']`

---

## 3. Phase 2: Enable Sanity API CDN

**Impact: ~15-25% API request reduction + major bandwidth reduction**
**Effort: Low**
**Risk: Low**

### The problem

The Sanity client is configured with `useCdn: false` and passes `token` on all requests:

```typescript
// next/src/utils/sanity.fetch.ts
const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,       // ← ALL queries go to uncached backend
  perspective: isPreviewDeployment ? 'drafts' : 'published',
  token,               // ← Token forces CDN bypass even if useCdn were true
});
```

This means:
- **0 out of 500,000 free CDN requests are used** (visible in every month's dashboard)
- Every query hits `api.sanity.io` (expensive, slow) instead of `apicdn.sanity.io` (free tier, fast)
- Even identical queries from different users/bots are never served from edge cache

### Step 2.1: Create two Sanity clients

**Approach:** Separate the read-only public client from the authenticated client.

```typescript
// Public client for read-only queries (products, courses, blog, etc.)
const publicClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,          // ← Use CDN for all read-only queries
  perspective: 'published',
  // No token — allows CDN caching
});

// Authenticated client for mutations, drafts, and preview
const authenticatedClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: isPreviewDeployment ? 'drafts' : 'published',
  token,
});
```

### Step 2.2: Route queries to the appropriate client

- `sanityFetch` (read-only, public content) → uses `publicClient`
- `sanityPatchQuantityInVariant`, `sanityPatchQuantity`, `sanityCreateReview` → uses `authenticatedClient` (they need write access)
- Preview deployments → uses `authenticatedClient` (need token for draft content)

### Step 2.3: Understand the CDN + tag-based revalidation interaction

Important nuance from Sanity docs: The CDN caches query results. When using tag-based revalidation with Next.js, the Data Cache is what gets invalidated — not the Sanity CDN cache. This means:

- After revalidation, the first request goes to Sanity CDN (which may still have cached the old result)
- Sanity CDN has a short TTL (~60 seconds), so stale data is brief
- For this e-commerce site, a ~60 second delay between content publish and frontend update is acceptable

If this delay is not acceptable for stock count updates, keep stock-sensitive queries on the authenticated client.

---

## 4. Phase 3: Cache Currently Uncached Queries

**Impact: ~10-15% API request reduction**
**Effort: Low**
**Risk: Low**

### Step 3.1: Sitemap query — add tags

**File:** `next/src/app/sitemap.ts`

Currently uncached (no tags). Every sitemap.xml request triggers a Sanity API call. Search engine bots and AI crawlers request sitemaps frequently.

**Fix:** Add tags to the sitemap query:
```typescript
return await sanityFetch({
  query: /* groq */ `{ ... }`,
  tags: ['product', 'course', 'bundle', 'voucher', 'BlogPost_Collection', 'BlogCategory_Collection', 'landingPage', 'CustomerCaseStudy_Collection'],
});
```

This caches the sitemap data and revalidates it when any content type changes — which is the correct behavior (sitemap should update when content updates).

### Step 3.2: Search API route — move to server action with caching

**File:** `next/src/app/api/search/route.ts`

Currently uncached (no tags). Every user search triggers a Sanity API call.

**Strategy:** Move search to a server action called from a client component, with `next: { revalidate: 300 }` (5-minute cache):
```typescript
const results = await publicClient.fetch(query, params, {
  next: { revalidate: 300 },
});
```

This replaces the API route with a server action that benefits from Next.js Data Cache, so repeated or similar searches within a 5-minute window don't hit Sanity.

### Step 3.3: Cart items hook — add caching or use CDN client

**File:** `next/src/utils/useCartItems.ts`

The `useCartItems` hook calls `sanityFetch` (server action) without tags. Every cart interaction triggers an uncached Sanity call.

**Fix:** Add tags to the cart query:
```typescript
const res = await sanityFetch<ProductCard[]>({
  query: `*[...]{...}`,
  tags: ['product', 'course', 'bundle', 'voucher'],
  params: { id: rawCart?.map((el) => el.product) || [] },
});
```

### Step 3.4: Add a default `revalidate` fallback in `sanityFetch`

**File:** `next/src/utils/sanity.fetch.ts`

Currently, if a query has no tags in production, it gets `cache: 'no-cache'`. Add a fallback:

```typescript
// Current: no tags = no cache
...(isPreviewDeployment || !tags
  ? { cache: 'no-cache' }
  : { next: { tags } })

// Improved: no tags = time-based revalidation (1 hour)
...(isPreviewDeployment
  ? { cache: 'no-cache' }
  : tags
    ? { next: { tags } }
    : { next: { revalidate: 3600 } })
```

This ensures that even forgotten/untagged queries don't bypass cache entirely — they just revalidate every hour.

---

## 5. Phase 4: Improve Revalidation Efficiency

**Impact: Small but prevents unnecessary cache busting**
**Effort: Low**
**Risk: Low**

### Step 4.1: Fix the revalidation webhook's own Sanity query

**File:** `next/src/app/api/revalidate/route.ts`

The webhook endpoint makes an uncached Sanity query to find references:
```typescript
return await sanityFetch<QueryType>({
  query: `${queryHeader}{ "references": *[references(^._id)]._type }`,
  // No tags = uncached
});
```

**Fix:** Use the CDN client for this query (it doesn't need real-time freshness — the reference structure doesn't change between when the webhook fires and when this query runs):
```typescript
return await publicClient.fetch(query, {}, { next: { revalidate: 60 } });
```

### Step 4.2: Be more surgical with tag revalidation

Currently, the webhook revalidates the document type tag AND all referencing document types. This can cause cascading cache invalidation. Consider being more targeted:
- When a `product` is updated, only revalidate `product` tag (not all courses that reference it)
- When a `productReviewCollection` is updated, only revalidate `productReviewCollection` tag

---

## 6. Projected Impact Summary

### Cost breakdown (January 2026 baseline: $305/month)

| Phase | Change | API Requests Reduction | Cost Savings |
|-------|--------|----------------------|----|
| Phase 1 | Static/dynamic split | ~50-60% | ~$120-140 |
| Phase 2 | Enable Sanity CDN | ~15-25% of remaining | ~$30-50 |
| Phase 3 | Cache uncached queries | ~10-15% of remaining | ~$15-25 |
| Phase 4 | Revalidation fixes | ~2-5% | ~$5 |

### Projected monthly cost after all phases

| Scenario | API Requests | Monthly Cost |
|----------|-------------|-------------|
| Current (Jan 2026) | 5.2M | **$305** |
| After Phase 1 only | ~1.5-2M | ~$140-160 |
| After Phases 1-2 | ~600K-1.2M | ~$50-80 |
| After Phases 1-3 | ~400K-800K | ~$20-50 |
| After all phases | ~300K-600K | **~$10-30** |

### Implementation priority

1. **Phase 1** (highest impact, highest effort) — the core architectural change
2. **Phase 2** (high impact, low effort) — quick win, can be done in parallel
3. **Phase 3** (medium impact, low effort) — quick win, can be done immediately
4. **Phase 4** (low impact, low effort) — polish

### Key files to modify

| File | Changes |
|------|---------|
| `next/src/utils/sanity.fetch.ts` | Two-client architecture, CDN, fallback revalidation |
| `next/src/app/(main)/(produkty)/layout.tsx` | Remove `force-dynamic` |
| `next/src/app/(main)/(kursy)/layout.tsx` | Remove `force-dynamic` |
| `next/src/components/_global/Header/Header.tsx` | Split into static + client-side user data |
| `next/src/app/(main)/(produkty)/produkty/*/[slug]/page.tsx` (5 files) | Move auth checks client-side |
| `next/src/app/(main)/(kursy)/*/[slug]/page.tsx` (2 files) | Move auth checks client-side |
| `next/src/app/(main)/(kursy)/*/[slug]/[lesson]/page.tsx` (2 files) | Move cookie check client-side |
| `next/src/utils/useCartItems.ts` | Add tags |
| `next/src/app/sitemap.ts` | Add cache tags |
| `next/src/app/api/search/route.ts` | Move to server action with revalidation |
| `next/src/app/api/revalidate/route.ts` | Use CDN client, optimize tag revalidation |
| All `generateStaticParams` functions (public pages) | Add appropriate cache tags |

### Files explicitly NOT modified

Everything under `app/(main)/moje-konto/` stays as-is. The logged-in client area is already correctly dynamic, blocked from bots, and contributes negligible Sanity API costs. Touching it would add significant complexity and risk for no meaningful cost benefit.

### Important consideration: the Header refactor

The Header refactor (Step 1.2) is the critical enabler for everything else. Without it, all pages under `app/(main)/` remain dynamic regardless of other changes. This is the single most important and most complex piece of the optimization.

The Header currently fetches server-side:
- Global navigation data (Sanity) — can be static
- Cart highlighted items (Sanity) — can be static
- User profile (Supabase) — must be dynamic/client-side
- User's courses progress (Supabase) — must be dynamic/client-side
- Virtual wallet balance (Supabase) — must be dynamic/client-side
- Delivery settings (Supabase admin) — can be cached

The split: Keep the Sanity data as a cached server component. Move all Supabase user data into a `<HeaderUserData />` client component that fetches on the client after hydration.
