'use server';
import { createClient, type QueryParams } from 'next-sanity';
import { isPreviewDeployment } from './is-preview-deployment';

const projectId = process.env.SANITY_PROJECT_ID;
const token = process.env.SANITY_API_TOKEN;
const dataset = 'production';
const apiVersion = '2024-03-20';

if (isPreviewDeployment && !token) {
  throw new Error('The `SANITY_API_TOKEN` environment variable is required.');
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: isPreviewDeployment ? 'previewDrafts' : 'published',
  ...(isPreviewDeployment && { token }),
});

/**
 * Performs a Sanity query in GROQ for fetching data.
 * @param {string} query - The GROQ query.
 * @param {string[]} [tags] - Recommended. The tags for Next Caching.
 * @param {QueryParams} [params={}] - Optional. Used to query dynamic pages, like blog posts.
 * @returns {Promise<QueryResponse>} Returns a promise of the page object.
 */
export default async function sanityFetch<QueryResponse>({
  query,
  tags,
  params = {},
}: {
  query: string;
  tags?: string[];
  params?: QueryParams;
}): Promise<QueryResponse> {
  return await client.fetch<QueryResponse>(query, params, {
    cache: isPreviewDeployment || !tags ? 'no-cache' : 'default',
    next: {
      tags: tags,
    },
  });
}

/**
 * Performs a Sanity query in GROQ for fetching data.
 * @param {string} id - Id of product that should be patched.
 * @param {string} key - Key of patched variant.
 * @param {number} quantity - Quantity to be patched.
 * @returns {Promise<SanityDocument<Record<string, any>>>} Returns a patched sanity record.
 */
export async function sanityPatchQuantityInVariant(id: string, key: string, quantity: number) {
  return await client
    .patch(id)
    .dec({ [`variants[_key == "${key}"].countInStock`]: quantity })
    .commit();
}

/**
 * Performs a Sanity query in GROQ for fetching data.
 * @param {string} id - Id of product that should be patched.
 * @param {number} quantity - Quantity to be patched.
 * @returns {Promise<SanityDocument<Record<string, any>>>} Returns a patched sanity record.
 */
export async function sanityPatchQuantity(id: string, quantity: number) {
  return await client.patch(id).dec({ countInStock: quantity }).commit();
}
