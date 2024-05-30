import { sanityPatchQuantity, sanityPatchQuantityInVariant } from '@/utils/sanity.fetch';
import { createClient } from '@/utils/supabase-admin';
import { addToGroup, removeFromGroup } from './mailer-lite';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateItemsQuantity(data: any) {
  const supabase = createClient();

  data?.products.array.forEach(
    async (product: {
      quantity: number;
      type: string;
      variantId: string;
      id: string;
      courses: null | { _id: string; automatizationId?: string; previewGroupMailerLite?: string }[];
    }) => {
      // create courses_progress record for each course
      if (product.courses) {
        const newCourses = product.courses.map(async (el) => {
          if (el.previewGroupMailerLite) {
            await removeFromGroup(data.billing.email, el.previewGroupMailerLite);
          }

          if (el.automatizationId) {
            await addToGroup(data.billing.email, data.billing.firstName, el.automatizationId);
          }

          return {
            owner_id: data.user_id,
            course_id: el._id,
            progress: null,
          };
        });
        const promiseContent = await Promise.all(newCourses);
        console.log('Promises', promiseContent);
        const res = await supabase.from('courses_progress').insert(promiseContent);
        console.log('Add progress', res);
      }

      // TODO: maybe move this to create step??
      if (product.variantId) {
        // decrease quantity of chosen variant of variable product
        const res = await sanityPatchQuantityInVariant(product.id, product.variantId, product.quantity);
        console.log('Update variant quantity', res);
      } else if (product.type === 'product') {
        // decrease quantity of each physical product
        const res = await sanityPatchQuantity(product.id, product.quantity);
        console.log('Update product quantity', res);
      }
    }
  );
}
