'use server';
import { createClient, type QueryParams } from 'next-sanity';
import { requestAsyncStorage } from 'next/dist/client/components/request-async-storage.external';

const projectId = process.env.SANITY_PROJECT_ID;
const token = process.env.SANITY_API_TOKEN;
const dataset = 'production';
const apiVersion = '2024-03-20';

const isDraftMode = !!requestAsyncStorage.getStore()?.draftMode.isEnabled;

if (isDraftMode && !token) {
  throw new Error('The `SANITY_API_TOKEN` environment variable is required.');
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: isDraftMode ? 'previewDrafts' : 'published',
  ...(isDraftMode && { token }),
});

/**
 * Performs a Sanity query in GROQ for fetching data.
 * @param {string} query - The GROQ query.
 * @param {string[]} [tags] - Recommended. The tags for Next Caching.
 * @param {QueryParams} [params={}] - Optional. Used to query dynamic pages, like blog posts.
 * @returns {Promise<QueryResponse>} Returns a promise of the SEO object.
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
    cache: isDraftMode || !tags ? 'no-cache' : 'default',
    next: {
      tags: tags,
    },
  });
}
