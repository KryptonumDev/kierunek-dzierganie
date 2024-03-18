import { createClient } from 'next-sanity';
import type { QueryParams } from '@sanity/client';
import { requestAsyncStorage } from 'next/dist/client/components/request-async-storage.external';

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;
const apiVersion = '2024-01-27';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  perspective: 'published',
  useCdn: false,
});

export default async function sanityFetch<QueryResponse>({
  query,
  tags,
  params = {},
}: {
  query: string;
  tags?: string[];
  params?: QueryParams;
}): Promise<QueryResponse> {
  const isDraftMode = !!requestAsyncStorage.getStore()?.draftMode.isEnabled;
  if (isDraftMode && !token) {
    throw new Error('The `SANITY_API_TOKEN` environment variable is required.');
  }
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
