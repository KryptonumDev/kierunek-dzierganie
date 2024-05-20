import { sanityPatchQuantity, sanityPatchQuantityInVariant } from '@/utils/sanity.fetch';
import { createClient } from '@/utils/supabase-admin';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateItemsQuantity(data: any) {
  const supabase = createClient();

  data?.products.array.forEach(
    async (product: {
      quantity: number;
      type: string;
      variantId: string;
      id: string;
      courses: null | { _id: string }[];
    }) => {
      // create courses_progress record for each course
      if (product.courses) {
        const newCourses = product.courses.map((el) => ({
          owner_id: data.user_id,
          course_id: el._id,
          progress: null,
        }));
        await supabase.from('courses_progress').insert(newCourses);
      }

      // TODO: maybe move this to create step??
      if (product.variantId) {
        // decrease quantity of chosen variant of variable product
        await sanityPatchQuantityInVariant(product.id, product.variantId, product.quantity);
      } else if (product.type === 'product') {
        // decrease quantity of each physical product
        await sanityPatchQuantity(product.id, product.quantity);
      }
    }
  );
}
