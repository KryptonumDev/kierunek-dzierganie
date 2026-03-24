/**
 * Resolves the current deployment's base URL with the following priority:
 *
 *  1. `SITE_URL` — set manually in Vercel env vars for production:
 *       SITE_URL=https://kierunekdzierganie.pl
 *
 *  2. `VERCEL_URL` — automatically injected by Vercel for every deployment
 *     (including preview branches). Does NOT include a protocol, so we prepend https://.
 *
 *  3. Falls back to the production domain so existing behaviour is unchanged
 *     when neither variable is present (e.g. local dev without a .env.local entry).
 *
 * Usage:
 *   import { siteUrl } from '@/utils/site-url';
 *   const redirect = `${siteUrl}/dziekujemy/${orderId}`;
 */
export const siteUrl: string =
  process.env.SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://kierunekdzierganie.pl');
