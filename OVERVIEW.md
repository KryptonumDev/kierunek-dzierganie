# Kierunek Dzierganie Overview

Last updated: 2026-04-16

## Purpose Of This Document

This document is meant to give future agents and engineers a fast but broad understanding of what this repository is, how the business works, how the codebase is organized, how the sibling admin panel fits in, and how the live storefront connects to Supabase, Sanity, payments, shipping, invoicing, analytics, and post-purchase automation.

This repository is the customer-facing storefront for `https://kierunekdzierganie.pl/`. It is not a standalone system:

- this repo contains the storefront and the Sanity Studio
- the sibling repo `/Users/oliwiersellig/Kryptonum/kierunek-dzierganie-admin` contains the back-office admin panel
- both repos share the same production Supabase backend

If you need only one sentence: this is a Polish ecommerce + digital learning platform for knitting and crochet, with a strong content layer, a course delivery area, physical-product checkout, coupons/vouchers, affiliate rewards, and post-purchase retention flows.

## Business Overview

### What The Brand Sells

Kierunek Dzierganie sells a mix of:

- digital knitting courses
- digital crochet courses
- physical products for knitting and crochet
- material packs tied to courses
- printable instructions and patterns
- gift vouchers
- newsletter and landing-page lead funnels
- affiliate / loyalty participation tied to store credit

The storefront is not just a product catalog. The commercial model combines:

- content marketing
- education products
- ecommerce for supplies and accessories
- repeat purchases after course adoption
- customer retention via account access, email groups, and affiliate wallet credit

### Target Customer

The live site messaging is aimed mainly at Polish-speaking women who want:

- a structured, beginner-friendly way to learn knitting or crochet
- a low-friction hobby they can do at home
- guided, step-by-step instruction instead of piecing information together themselves
- an emotional outcome, not only a technical one: relaxation, confidence, agency, creativity, and community

### Business Positioning

The brand is positioned around:

- learning from zero
- going at your own pace
- combining video + written materials
- trust in a visible founder/expert voice
- turning course buyers into repeat buyers of kits, instructions, and related products

### Revenue And Retention Logic

The storefront supports several business loops at once:

1. Discovery loop:
   blog, SEO pages, category pages, and landing pages bring users in.
2. Conversion loop:
   visitors buy courses, products, bundles, or vouchers.
3. Cross-sell loop:
   course buyers are offered related material packs, instructions, or post-purchase offers.
4. Retention loop:
   customers keep access through the account area, receive follow-up emails, join MailerLite groups, and return to buy more.
5. Advocacy loop:
   affiliate / loyalty mechanics reward referrals with virtual wallet credit.

## System Map

### High-Level Architecture

The working system is split into four main layers:

1. Storefront repo: `/Users/oliwiersellig/Kryptonum/kierunek-dzierganie`
   customer-facing site, checkout, account area, public pages, course playback, API routes.
2. Admin repo: `/Users/oliwiersellig/Kryptonum/kierunek-dzierganie-admin`
   operational back office for orders, clients, coupons, affiliate reporting, settings, statistics, invoicing, and shipping.
3. Sanity
   content and catalog source of truth for most public pages, courses, products, bundles, blog, landing pages, and many dashboard page texts.
4. Supabase
   transactional backend for auth, profiles, orders, coupons, course progress, settings, affiliate wallet, and admin access.

### Shared Backend

The production Supabase project used by both storefront and admin is:

- project id: `baujxpfhgvzpwyqhylxt`
- project name: `Dashboard`
- region: `eu-central-1`

Sanity project:

- project id: `5q82mab3`
- dataset: `production`

### Core Responsibility Split

- Sanity answers: what exists, how it is presented, what content and merchandising copy should render
- Supabase answers: who the customer is, what they bought, what they can access, what discounts they can use, what operational state their order is in
- the storefront answers: how the customer moves through browsing, checkout, payment, and account consumption
- the admin repo answers: how operators manage the underlying business state

## Repository Structure

### Root

At the root of this repository:

- `next/` is the storefront Next.js app
- `sanity/` is the Sanity Studio
- root `package.json` uses Bun workspaces to run both

### Storefront App

Important top-level directories under `next/`:

- `src/app`
  Next.js App Router pages, layouts, and API routes
- `src/components`
  UI and business components for global pages, products, blog, dashboard, checkout, landing pages, and post-purchase flows
- `src/utils`
  business helpers for coupons, shipping, course access, progress, Supabase, Sanity, vouchers, wallet logic, and formatting
- `src/global`
  shared types, constants, SEO helpers, and schema helpers
- `src/emails`
  transactional email templates
- `public`
  static assets

### Sanity Studio

Important Sanity areas:

- `sanity/schemas/singleTypes`
  singleton page and global content definitions
- `sanity/schemas/collectionTypes`
  collections for courses, products, bundles, blog posts, landing pages, reviews, FAQs, authors, etc.
- `sanity/schemas/components`
  modular content blocks rendered in the storefront
- `sanity/deskStructure.jsx`
  custom editor navigation and preview configuration

## What Lives In The Storefront Repo

### Main Public Site

The public site includes:

- homepage
- course categories
- product categories
- individual course and product pages
- blog
- student stories / case studies
- about, team, partners, brands, cooperation, contact
- newsletter pages
- legal pages
- affiliate program marketing page

Most of these pages are server-rendered from Sanity content using GROQ queries.

### Customer Account Area

The `/moje-konto` area is the customer dashboard and learning zone. It includes:

- login / authorization
- password reset / set password / account confirmations
- my courses
- lesson playback
- certificate page
- order history
- order detail pages
- downloadable files
- personal data
- loyalty / affiliate dashboard
- help / support

Middleware guards account routes and redirects unauthenticated users into auth flow.

### Checkout And Commerce

The storefront owns:

- cart state and checkout UI
- guest checkout and logged-in checkout
- coupon verification
- shipping method selection
- payment creation
- payment verification redirect handling
- payment webhook completion
- post-purchase thank-you pages
- review submission
- newsletter and lead capture

## Route Groups And Page Model

### Main Route Groups

The storefront uses App Router route groups. The important ones are:

- `src/app/(main)`
  main public site and account area
- `src/app/(main)/(kursy)`
  course category and course detail routes
- `src/app/(main)/(produkty)`
  product category and product detail routes
- `src/app/(landing)`
  campaign / landing pages and dedicated thank-you pages
- `src/app/api`
  route handlers for operational logic

### Notable Public Routes

Representative public pages include:

- `/`
- `/kursy-dziergania-na-drutach`
- `/kursy-szydelkowania`
- `/produkty`
- `/produkty/dzierganie`
- `/produkty/szydelkowanie`
- `/produkty/instrukcje`
- `/produkty/pakiety-materialow`
- `/blog`
- `/historia-kursantek/[slug]`
- `/program-partnerski`
- `/kontakt`
- `/newsletter`
- `/regulamin`
- `/polityka-prywatnosci`

### Notable Account Routes

- `/moje-konto/autoryzacja`
- `/moje-konto/kursy`
- `/moje-konto/kursy/[courseSlug]`
- `/moje-konto/kursy/[courseSlug]/[lessonSlug]`
- `/moje-konto/kursy/[courseSlug]/certyfikat`
- `/moje-konto/zakupy`
- `/moje-konto/zakupy/[id]`
- `/moje-konto/pliki-do-pobrania`
- `/moje-konto/dane`
- `/moje-konto/program-lojalnosciowy`
- `/moje-konto/pomoc`

### Important API Routes

- `/api/payment/create`
- `/api/payment/verify`
- `/api/payment/complete`
- `/api/payment/delete`
- `/api/coupon/verify`
- `/api/coupon/get`
- `/api/affiliate/join`
- `/api/course-access/expire`
- `/api/mailerlite`
- `/api/discount`
- `/api/contact`
- `/api/review/create`
- `/api/revalidate`
- `/api/post-purchase-offer/[orderId]`

## Content Model And Sanity Usage

### Sanity Is A Real Production Dependency

The root README understates this. Sanity is not “to be added”; it is active and central.

The storefront reads from Sanity for:

- homepage and singleton pages
- course and product catalog entries
- bundles and vouchers
- blog posts and categories
- landing pages
- customer case studies
- reviews and FAQs
- dashboard text sections
- SEO metadata
- preview environments
- post-purchase offer configuration

### How Rendering Works

The `next/src/components/Components.tsx` file is the modular content registry. It maps Sanity block types to React components. Many marketing and content pages are basically:

- GROQ query
- singleton or collection document from Sanity
- `content[]`
- mapped through this component registry

This means many UI changes should start in:

- Sanity schema definitions
- GROQ fragments
- block component implementations

### Sanity Preview Notes

The Sanity desk structure includes previews for:

- public web pages
- products
- courses
- bundles
- special post-purchase offer previews for courses and bundles

This matters because merchandised behavior is often configured in Sanity, not hardcoded in the storefront.

## Supabase Data Model

### Core Tables

The live production schema centers around these tables:

- `profiles`
- `orders`
- `orders_statuses`
- `courses_progress`
- `coupons`
- `coupons_types`
- `coupons_states`
- `coupons_uses`
- `virtual_wallet`
- `virtual_wallet_transactions`
- `settings`
- `admin_users`

### Profiles

`profiles` extends `auth.users` and stores customer-facing account state:

- email
- billing data JSON
- shipping data JSON
- avatar URL
- left-handed preference
- autoplay preference
- last watched course
- last watched list

The `handle_new_user()` trigger creates profile rows automatically on auth signup.

### Orders

`orders` is the central transaction ledger and includes:

- status
- amount
- products JSON payload
- billing and shipping JSON
- payment method and payment id
- paid timestamp
- refund data
- parcel data
- guest order fields
- used discount / used discounts
- used virtual wallet money
- verification and post-processing flags

This table is the operational anchor for checkout, payments, invoices, shipping, analytics, and account history.

### Course Access And Progress

`courses_progress` stores both entitlement and progression:

- owner id
- course id
- nested lesson progress JSON
- access granted timestamp
- access expires timestamp
- source order id
- MailerLite cleanup marker for expired access

This table drives:

- whether a user can open a course
- whether course access has expired
- lesson progress
- “last watched” logic
- certificate readiness
- access cleanup jobs

### Coupons

The coupon engine is more sophisticated than a simple single-code discount model.

It supports:

- percentage discounts
- fixed cart discounts
- fixed product discounts
- free delivery
- voucher logic
- per-user limits
- usage limits
- category restrictions
- product-specific discount targets
- affiliate ownership via `affiliation_of`
- usage history through `coupons_uses`

The newer `used_discounts` order field indicates multi-coupon support has been added on top of legacy single-coupon behavior.

### Loyalty / Affiliate Wallet

Affiliate rewards are not managed by a dedicated affiliate table. Instead:

- coupon ownership identifies the referring user
- reward credit is tracked in `virtual_wallet_transactions`
- the effective usable balance is derived via RPC
- `virtual_wallet` acts like a cached balance record

### Settings

`settings` stores operational configuration used at runtime. Named setting groups seen in code include:

- `general`
- `apaczka`
- `ifirma`

These feed shipping fees, free-shipping thresholds, invoicing setup, and related operational logic.

### Admin Users

`admin_users` marks which profile IDs can access the admin panel. The admin repo checks this table after Supabase auth login.

## Shared Business Flows

### 1. Discovery And Merchandising Flow

Traffic arrives through:

- SEO landing on course pages
- product category pages
- blog posts
- dedicated landing pages
- newsletter / ad flows
- affiliate referrals

Sanity controls much of the content and structure for this layer. The storefront then adds commerce logic and account awareness on top.

### 2. Cart And Checkout Flow

Checkout starts in a client-side cart UI, but server-side validation is authoritative.

The server rechecks:

- billing and shipping shapes
- Polish postal code formatting
- cart contents are not empty
- shipping requirements
- shipping method validity
- Paczkomat selection requirements
- free-shipping thresholds
- owned-course restrictions
- product-to-course relationship constraints
- fixed-date course expiry
- coupon applicability and restrictions

This means UI and API logic both matter. Never assume the client view is the source of truth.

### 3. Payment Creation Flow

`/api/payment/create` is one of the most important files in the repo.

It:

- reads operational settings from Supabase
- fetches shipping data from Sanity
- resolves delivery mode and declared shipment value
- validates products and access conditions
- persists an order row before payment finalization
- creates a Przelewy24 payment session
- supports guest checkout paths
- includes order payload details used later in fulfillment

### 4. Payment Verification And Webhook Flow

Payment completion is split into two stages.

Browser-return verification:

- `/api/payment/verify`
- checks Przelewy24 transaction state
- decides where the user should land next
- may route logged-in customers either to order detail or post-purchase offer

Webhook completion:

- `/api/payment/complete`
- validates P24 signature
- loads the authoritative order from Supabase
- marks the order paid
- records coupon usage
- schedules background fulfillment

The split is deliberate: the system acknowledges payment quickly, then runs heavier side effects in background.

### 5. Background Fulfillment Flow

`process-background.ts` executes the post-payment side effects:

1. verify transaction with P24 again
2. update inventory / stock / entitlement state
3. generate invoice in iFirma
4. create voucher coupons where needed
5. send customer and internal emails with Resend
6. send GA and Meta purchase events

This is the most side-effect-heavy part of the storefront.

### 6. Course Access Flow

Digital delivery depends on `courses_progress` and Sanity course metadata.

The storefront resolves access using:

- active vs expired access windows
- course access mode: unlimited, duration-based, or fixed-date
- profile-level last watched references
- lesson progress JSON

This affects:

- my courses listing
- lesson playback
- certificate pages
- dashboard summaries
- cleanup for expired access

### 7. Post-Purchase Offer Flow

The storefront contains conditional post-purchase upsell logic.

If a purchased course or bundle has a configured post-purchase offer:

- the customer is redirected to `/dziekujemy/[orderId]`
- the order is inspected
- the offer is resolved against Sanity
- a coupon may be created lazily and idempotently in Supabase
- an upsell or newsletter capture section may be shown

This flow links Sanity merchandising with Supabase coupon creation.

### 8. Voucher Flow

Vouchers are first-class products:

- they can be digital or physical
- digital vouchers can be attached as PDFs in outgoing emails
- voucher coupon records are created after successful payment
- voucher balance can be checked through the storefront

### 9. Coupon And Discount Flow

Coupon handling is non-trivial and spread across:

- checkout UI
- `/api/coupon/verify`
- `coupon-eligibility.ts`
- payment create / complete logic
- admin coupon management

The repo supports:

- stacked discount logic
- restricted coupons
- per-product discount logic
- eligible subtotal calculations
- voucher-specific balance usage
- affiliate-owned coupon flows

Any discount-related change should be treated as a cross-cutting change, not a one-file edit.

### 10. Affiliate And Loyalty Flow

Affiliate logic is customer-facing and operational:

- customers can join an affiliate program
- coupon ownership identifies the affiliate
- orders can contribute wallet credit
- wallet balance is shown in the customer dashboard
- the admin repo exposes affiliate reporting and top affiliates

This is closer to “store credit reward” than a standalone payout engine.

### 11. Newsletter And Lead Funnel Flow

MailerLite is used at multiple stages:

- normal newsletter signup
- preview lesson leads
- product option forms
- landing page thank-you flows with dedicated discount creation
- buyer group sync after purchase
- cleanup when access expires

So MailerLite here is not only marketing infrastructure; it is also a lightweight entitlement / segmentation tool.

### 12. Physical Product Fulfillment Flow

Physical fulfillment logic touches both repos.

In storefront:

- delivery need is resolved from product/course/bundle/voucher data
- checkout collects shipping info
- order stores shipping method and declared shipment value context

In admin:

- operators manage order statuses
- shipment creation uses Apaczka
- invoices are created in iFirma
- parcel data is stored back on orders

This means order status progression is partly automated and partly operator-driven.

## Admin Panel Overview

### Where It Lives

Sibling repo:

- `/Users/oliwiersellig/Kryptonum/kierunek-dzierganie-admin`

### What It Does

The admin panel is the operating console over the same Supabase database. It handles:

- orders
- clients
- statistics
- coupons
- affiliate reporting
- settings

### Main Screens

The control panel includes:

- `/orders`
- `/statistics`
- `/clients`
- `/coupons`
- `/affiliate`
- `/settings`

The app also has:

- a public login page at `/`
- session-refresh middleware
- an explicit second admin authorization check in the authorized layout

### Operational Responsibilities

Admin operators use it to:

- inspect and filter orders
- run bulk actions and exports
- open detailed single-order workflows
- review status counts
- create and manage coupons
- inspect client accounts and course access
- manually add course access where needed
- invite users and trigger password reset flows
- review affiliate-linked orders
- inspect top affiliants
- edit runtime settings like invoicing and shipping config

The single-order workflow is especially important. That is where operators can:

- inspect and edit billing and shipping data
- change statuses and notes
- generate invoices
- create shipping orders
- download waybills
- trigger refunds

### Admin Auth Model

Admin authentication is:

- standard Supabase auth
- followed by service-role lookup in `admin_users`
- session handling via middleware
- enforced in the authorized layout

### Important Coupling To This Repo

The admin repo is tightly coupled to this storefront because:

- both use the same Supabase tables
- checkout-created orders are managed in admin
- storefront coupon behavior must match admin coupon definitions
- storefront shipping and invoice behavior depends on admin-managed settings
- storefront access provisioning must align with admin client/course tooling
- admin statistics and affiliate reporting depend on storefront order payload shape

If you change order structure, coupon semantics, or settings schema in this repo, you must assume the admin repo will also need changes.

The strongest shared boundary is `courses_progress`. The storefront provisions and consumes access there, while the admin panel uses the same table for support operations, enrollment counting, and manual entitlement repair.

## Integrations

### Payment

- Przelewy24

Used for:

- creating payment sessions
- browser return verification
- webhook confirmation

### Invoicing

- iFirma

Used for:

- invoice creation
- invoice download
- bill references stored on orders

### Shipping

- Apaczka

Used for:

- shipping configuration
- parcel creation
- waybill handling
- order fulfillment tooling in admin

### Refunds

- Przelewy24

Used in admin for:

- refund initiation from order detail workflows
- persisting refund state back into `orders`

### Email

- Resend

Used for:

- customer order email
- voucher attachments
- internal order notifications
- contact forms and error reporting patterns

### CRM / Marketing Automation

- MailerLite

Used for:

- newsletter groups
- preview lesson groups
- buyer groups
- post-purchase opt-ins
- lead-triggered discounts
- expired-access cleanup

### Analytics / Ad Tracking

- Google Analytics
- Meta conversions
- GTM on the storefront side

### Deployment / Runtime

- Vercel conventions are built into runtime behavior
- preview deployments affect Sanity fetching and preview URLs
- `siteUrl` resolves deploy-aware base URL logic
- `waitUntil` is used for background fulfillment

## Important Runtime Files

### Storefront Entry And Routing

- `next/src/app/layout.tsx`
- `next/src/app/(main)/layout.tsx`
- `next/src/middleware.ts`
- `next/src/app/sitemap.ts`
- `next/src/app/robots.ts`
- `next/redirects.mjs`

### Storefront Commerce Core

- `next/src/app/api/payment/create/route.ts`
- `next/src/app/api/payment/verify/route.ts`
- `next/src/app/api/payment/complete/route.ts`
- `next/src/app/api/payment/complete/process-background.ts`
- `next/src/app/api/payment/complete/send-emails.ts`
- `next/src/app/api/payment/complete/update-items-quantity.ts`
- `next/src/app/api/payment/complete/generate-bill.ts`

### Storefront Domain Helpers

- `next/src/utils/sanity.fetch.ts`
- `next/src/utils/supabase-server.ts`
- `next/src/utils/supabase-admin.ts`
- `next/src/utils/course-access.ts`
- `next/src/utils/coupon-eligibility.ts`
- `next/src/utils/resolve-post-purchase-offer.ts`
- `next/src/utils/resolve-shipping-mode.ts`
- `next/src/utils/resolve-shipment-declared-value.ts`
- `next/src/utils/virtual-wallet.ts`

### Shared Types

- `next/src/global/types.ts`
- `next/src/global/constants.ts`

### Sanity Core

- `sanity/sanity.config.js`
- `sanity/deskStructure.jsx`
- `sanity/schemas/index.js`
- `sanity/schemas/singleTypes/*`
- `sanity/schemas/collectionTypes/*`
- `sanity/schemas/components/*`

### Admin Core

- `/Users/oliwiersellig/Kryptonum/kierunek-dzierganie-admin/src/app/(authorized)/layout.tsx`
- `/Users/oliwiersellig/Kryptonum/kierunek-dzierganie-admin/src/middleware.ts`
- `/Users/oliwiersellig/Kryptonum/kierunek-dzierganie-admin/src/app/actions.ts`
- `/Users/oliwiersellig/Kryptonum/kierunek-dzierganie-admin/src/actions/get-orders.ts`
- `/Users/oliwiersellig/Kryptonum/kierunek-dzierganie-admin/src/actions/get-statistics.ts`
- `/Users/oliwiersellig/Kryptonum/kierunek-dzierganie-admin/src/actions/get-course-enrollments.ts`
- `/Users/oliwiersellig/Kryptonum/kierunek-dzierganie-admin/src/actions/get-coupons.ts`
- `/Users/oliwiersellig/Kryptonum/kierunek-dzierganie-admin/src/actions/get-configs.ts`
- `/Users/oliwiersellig/Kryptonum/kierunek-dzierganie-admin/src/actions/get-affiliated-orders.ts`
- `/Users/oliwiersellig/Kryptonum/kierunek-dzierganie-admin/src/utils/supabase-admin.ts`
- `/Users/oliwiersellig/Kryptonum/kierunek-dzierganie-admin/src/utils/sanity-fetch.ts`
- `/Users/oliwiersellig/Kryptonum/kierunek-dzierganie-admin/src/app/(authorized)/orders/(order)/[id]/content.tsx`
- `/Users/oliwiersellig/Kryptonum/kierunek-dzierganie-admin/src/app/api/payment/refund/route.ts`
- `/Users/oliwiersellig/Kryptonum/kierunek-dzierganie-admin/src/app/api/apaczka/create-order/route.ts`
- `/Users/oliwiersellig/Kryptonum/kierunek-dzierganie-admin/src/app/api/ifirma/create-faktura/route.ts`
- `/Users/oliwiersellig/Kryptonum/kierunek-dzierganie-admin/database.types.ts`

## Known Drift, Risks, And Gotchas

### 1. Documentation Drift

The root README still describes Sanity as something “to be added,” but Sanity is already production-critical.

### 2. Admin Types Drift

The admin repo’s generated `database.types.ts` is behind the live Supabase schema in at least some areas, especially `courses_progress`. Treat the live database and active storefront code as the source of truth.

### 3. Payment Pipeline Is High Risk

Changes around:

- `orders.products`
- discount payloads
- voucher metadata
- shipping metadata
- invoice assumptions
- fulfillment side effects

can easily break either checkout or post-payment processing.

### 4. Service-Role Usage Is Normal But Sensitive

Many server routes and server components use the Supabase service role. That is expected here, but it increases the impact of mistakes in server/client separation.

### 5. Business Rules Are Distributed

Rules for coupons, access, shipping, and order status are split across:

- checkout UI
- API routes
- utility helpers
- admin actions
- Supabase schema / RPC behavior

Future changes need cross-repo coordination.

### 6. Supabase Advisor Notes

Observed live-database concerns worth keeping in mind:

- several RLS-enabled tables have no explicit policies and are effectively service-role only
- several functions have mutable `search_path`
- some foreign keys lack covering indexes
- some duplicate indexes exist
- one permissive insert policy exists on `courses_progress`

These are not necessarily active incidents, but they are good candidates for hardening work.

### 7. Route Compatibility Matters

The large redirects file means historical URLs are intentionally preserved. Route changes should be treated as migration work.

## How To Approach This Codebase As A Future Agent

### If The Task Is About Content Or Merchandising

Start in:

- Sanity schema files
- GROQ queries on the relevant page
- `next/src/components/Components.tsx`
- the specific block component used on the page

### If The Task Is About Checkout, Payment, Or Orders

Start in:

- `next/src/app/api/payment/create/route.ts`
- `next/src/app/api/payment/complete/route.ts`
- `next/src/app/api/payment/complete/process-background.ts`
- `next/src/app/api/coupon/verify/route.ts`
- admin `get-orders.ts`

Then verify the shared Supabase schema assumptions.

### If The Task Is About Course Access Or Learning UX

Start in:

- `next/src/utils/course-access.ts`
- `next/src/app/(main)/moje-konto/(authorized)/kursy/page.tsx`
- lesson and course account routes
- `courses_progress` schema and related helpers

### If The Task Is About Affiliate / Loyalty

Start in:

- customer loyalty page in storefront
- `virtual-wallet.ts`
- `coupons` and `coupons_uses`
- admin affiliate pages and queries

### If The Task Is About Shipping Or Invoicing

You will probably need both repos:

- storefront payment creation and background fulfillment
- admin Apaczka routes
- admin iFirma routes
- Supabase `settings`
- order status logic

### If The Task Is About “Why Does This Business Rule Exist?”

Look in this order:

1. live storefront page and wording
2. Sanity schema and content fields
3. storefront utility helpers
4. Supabase table shape or RPC
5. admin action/query that operates on the same concept

## Final Orientation

This is best understood as a connected commerce system, not just a Next.js website:

- Sanity is the content brain
- Supabase is the transactional spine
- the storefront is the customer journey
- the admin panel is the operator journey

Almost every meaningful change sits at the boundary between at least two of those layers.
