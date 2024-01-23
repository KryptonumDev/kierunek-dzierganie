import 'server-only';

import { createClient } from 'next-sanity';
import type { QueryParams } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03';

export const client = createClient({
  projectId,
  dataset,
  apiVersion, // https://www.sanity.io/docs/api-versioning
  useCdn: true, // if you're using ISR or only static generation at build time then you can set this to `false` to guarantee no stale content
});

const DEFAULT_PARAMS = {} as QueryParams;
// const DEFAULT_TAGS = [] as string[];

export async function sanityFetch<QueryResponse>({
  query,
  params = DEFAULT_PARAMS,
  // tags = DEFAULT_TAGS,
}: {
  query: string;
  params?: QueryParams;
  // tags: string[];
}): Promise<QueryResponse> {
  return await client.fetch<QueryResponse>(query, params, {
    // cache: 'force-cache', // for tag-based revalidation
    next: {
      revalidate: 30, // for simple, time-based revalidation
      // tags, // for tag-based revalidation
    },
  });
}
