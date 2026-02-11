'use server';
import { createClient, type QueryParams } from 'next-sanity';
import { isPreviewDeployment, isProductionDeployment } from './is-preview-deployment';

const projectId = process.env.SANITY_PROJECT_ID;
const token = process.env.SANITY_API_TOKEN;
const dataset = 'production';
const apiVersion = '2024-04-22';

if (isPreviewDeployment && !token) {
  throw new Error('The `SANITY_API_TOKEN` environment variable is required.');
}

/**
 * Public client for read-only queries (products, courses, blog, etc.)
 * Uses CDN for cached responses — no token, so Sanity edge cache is used.
 */
const publicClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
});

/**
 * Authenticated client for mutations, drafts, and preview deployments.
 * Uses the uncached API backend with a token.
 */
const authenticatedClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: isPreviewDeployment ? 'drafts' : 'published',
  token,
});

/**
 * Performs a Sanity query in GROQ for fetching data.
 * Uses the CDN-backed public client in production, and the authenticated client
 * for preview deployments or when explicitly requested.
 *
 * @param {string} query - The GROQ query.
 * @param {string[]} [tags] - Recommended. The tags for Next Caching.
 * @param {QueryParams} [params={}] - Optional. Used to query dynamic pages, like blog posts.
 * @param {boolean} [useAuthClient=false] - Optional. Force usage of the authenticated client (for stock checks, etc.).
 * @returns {Promise<QueryResponse>} Returns a promise of the page object.
 */
export default async function sanityFetch<QueryResponse>({
  query,
  tags,
  params = {},
  useAuthClient = false,
}: {
  query: string;
  tags?: string[];
  params?: QueryParams;
  useAuthClient?: boolean;
}): Promise<QueryResponse> {
  const client = isPreviewDeployment || useAuthClient ? authenticatedClient : publicClient;

  return await client.fetch<QueryResponse>(query, params, {
    ...(!isProductionDeployment
      ? {
          cache: 'reload',
        }
      : {
          ...(isPreviewDeployment
            ? { cache: 'no-cache' }
            : tags
              ? { next: { tags } }
              : { next: { revalidate: 3600 } }),
        }),
  });
}

export async function sanityPatchQuantityInVariant(id: string, key: string, quantity: number) {
  const countInStock = await authenticatedClient.fetch<number>(
    `*[_id == "${id}"][0].variants[_key == "${key}"][0].countInStock`
  );
  return await authenticatedClient
    .patch(id)
    .dec({ [`variants[_key == "${key}"].countInStock`]: quantity > countInStock ? countInStock : quantity })
    .commit();
}

export async function sanityPatchQuantity(id: string, quantity: number) {
  return await authenticatedClient.patch(id).dec({ countInStock: quantity }).commit();
}

export async function sanityCreateReview(data: {
  rating: number;
  review: string;
  nameOfReviewer: string;
  course: string;
}) {
  return await authenticatedClient.create({
    _type: 'productReviewCollection',
    rating: Number(data.rating),
    review: data.review,
    nameOfReviewer: data.nameOfReviewer,
    visible: false,
    course: {
      _type: 'reference',
      _ref: data.course,
    },
  });
}
