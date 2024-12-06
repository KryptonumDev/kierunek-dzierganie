'use server';
import { createClient, type QueryParams } from 'next-sanity';
import { isPreviewDeployment, isProductionDeployment } from './is-preview-deployment';

const projectId = process.env.SANITY_PROJECT_ID;
const token = process.env.SANITY_API_TOKEN;
const dataset = 'development';
const apiVersion = '2024-04-22';

if (isPreviewDeployment && !token) {
  throw new Error('The `SANITY_API_TOKEN` environment variable is required.');
}

console.log(isPreviewDeployment);
console.log(isProductionDeployment);

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  // perspective: isPreviewDeployment ? 'previewDrafts' : 'published',
  token,
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
    ...(!isProductionDeployment
      ? {
          cache: 'reload',
        }
      : {
          ...(isPreviewDeployment || !tags
            ? {
                cache: 'no-cache',
              }
            : {
                next: {
                  tags,
                },
              }),
        }),
  });
}

export async function sanityPatchQuantityInVariant(id: string, key: string, quantity: number) {
  return await client
    .patch(id)
    .dec({ [`variants[_key == "${key}"].countInStock`]: quantity })
    .commit();
}

export async function sanityPatchQuantity(id: string, quantity: number) {
  return await client.patch(id).dec({ countInStock: quantity }).commit();
}

export async function sanityCreateReview(data: {
  rating: number;
  review: string;
  nameOfReviewer: string;
  course: string;
}) {
  return await client.create({
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
