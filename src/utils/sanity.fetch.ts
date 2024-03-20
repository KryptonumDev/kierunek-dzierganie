import { createClient } from 'next-sanity';
import type { QueryParams } from '@sanity/client';
import { requestAsyncStorage } from 'next/dist/client/components/request-async-storage.external';

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;
const apiVersion = '2024-01-27';

const isDraftMode = !!requestAsyncStorage.getStore()?.draftMode.isEnabled;

if (isDraftMode && !token) {
  throw new Error('The `SANITY_API_TOKEN` environment variable is required.');
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  perspective: isDraftMode ? 'previewDrafts' : 'published',
  useCdn: false,
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
    ...(isDraftMode && {
      token: token,
      perspective: 'previewDrafts',
    }),
    cache: isDraftMode || !tags ? 'no-cache' : 'default',
    next: {
      tags: tags,
    },
  });
}
