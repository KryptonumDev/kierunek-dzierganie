import { createClient } from 'next-sanity';
import type { QueryParams } from '@sanity/client';

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || 'production';
const apiVersion = '2024-01-23';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  perspective: 'published',
});

const DEFAULT_PARAMS = {} as QueryParams;

export default async function sanityFetch<QueryResponse>(
  query: string,
  params: QueryParams = DEFAULT_PARAMS,
): Promise<QueryResponse> {
  return await client.fetch<QueryResponse>(query, params, {
    next: {
      revalidate: 900,
    },
  });
}