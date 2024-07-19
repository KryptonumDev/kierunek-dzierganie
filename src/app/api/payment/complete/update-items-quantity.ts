import { sanityPatchQuantity, sanityPatchQuantityInVariant } from '@/utils/sanity.fetch';
import { createClient } from '@/utils/supabase-admin';
import { addToGroup } from './mailer-lite';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateItemsQuantity(data: any) {
  const supabase = createClient();

  const res = await data?.products.array.map(
    async (product: {
      quantity: number;
      type: string;
      variantId: string;
      id: string;
      courses: null | { _id: string; automatizationId?: string; previewGroupMailerLite?: string }[];
    }) => {
      // create courses_progress record for each course
      if (product.courses) {
        console.log('Produkt z kursem:', product);
        const newCourses = product.courses.map(async (el) => {
          if (el.automatizationId) {
            try {
              const addToGroupData = {
                email: data.billing?.email,
                name: data.billing?.firstName,
                group: el.automatizationId,
              };
              console.log('Add to group data', addToGroupData);
              const res = await addToGroup(addToGroupData.email, addToGroupData.name, addToGroupData.group);
              console.log('Add to group', res);
            } catch (error) {
              console.error('Error while adding to group', error);
            }
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
        try {
          const res = await sanityPatchQuantityInVariant(product.id, product.variantId, product.quantity);
          console.log('Update variant quantity', res);
        } catch (error) {
          console.error('Error while updating variant quantity', error);
        }
      } else if (product.type === 'product') {
        // decrease quantity of each physical product
        try {
          const res = await sanityPatchQuantity(product.id, product.quantity);
          console.log('Update product quantity', res);
        } catch (error) {
          console.error('Error while updating product quantity', error);
        }
      }
    }
  );
  console.log('Promises ', res);
  const promiseResult = await Promise.all(res);
  console.log('Promise result ', promiseResult);
}
