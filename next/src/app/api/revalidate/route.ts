import { NextRequest } from 'next/server';
import { revalidateTag } from 'next/cache';

type RequestType = {
  tag: string;
  id?: string;
};

/**
 * Static dependency map: when a document of type X changes,
 * which other cache tags should also be revalidated?
 *
 * Derived from the GROQ queries across the codebase — these represent
 * cross-references between document types (e.g., courses reference products
 * via materials_link, printed_manual, related_products).
 *
 * Update this map when adding new cross-reference relationships in the Sanity schema.
 */
const DEPENDENCY_MAP: Record<string, string[]> = {
  // Products are referenced by courses (materials_link, related_products, printed_manual)
  product: ['course'],
  // Courses are referenced by bundles (bundle contains courses) and products (relatedCourses)
  course: ['bundle', 'product'],
  // Bundles are referenced by courses (relatedBundle)
  bundle: ['course'],
  // Vouchers are listed alongside products
  voucher: ['product'],
  // Lessons are embedded in courses
  lesson: ['course'],
  // Reviews reference products, courses, and bundles
  productReviewCollection: ['product', 'course', 'bundle'],
  // Blog categories are referenced by blog posts
  BlogCategory_Collection: ['BlogPost_Collection'],
  // Blog posts may appear on the blog page
  BlogPost_Collection: ['Blog_Page'],
};

export async function POST(request: NextRequest) {
  const authorizationHeader = request.headers.get('Authorization');

  if (authorizationHeader !== `Bearer ${process.env.SANITY_REVALIDATE_TOKEN}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { tag } = (await request.json()) as RequestType;

  if (!tag) {
    return Response.json({ revalidated: false, now: Date.now() });
  }

  // Collect all tags to revalidate: the changed type + its dependents
  const tagsToRevalidate = new Set<string>();
  tagsToRevalidate.add(tag);

  const dependents = DEPENDENCY_MAP[tag];
  if (dependents) {
    dependents.forEach((dep) => tagsToRevalidate.add(dep));
  }

  // Revalidate each unique tag once
  tagsToRevalidate.forEach((t) => revalidateTag(t));

  return Response.json({
    revalidated: true,
    tags: Array.from(tagsToRevalidate),
    now: Date.now(),
  });
}
