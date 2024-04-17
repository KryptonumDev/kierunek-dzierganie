import styles from './RelatedProducts.module.scss';
import type { RelatedProductsTypes } from './RelatedProducts.types';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import sanityFetch from '@/utils/sanity.fetch';
import { PRODUCT_CARD_QUERY } from '@/global/constants';
import Card from '@/components/ui/ProductCard';
import type { ProductCard } from '@/global/types';

const RelatedProducts = async ({ _id, title, text, basis }: RelatedProductsTypes) => {
  const supabase = createServerActionClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const id = [_id];

  if (user) {
    const res = await supabase
      .from('profiles')
      .select(
        `
        id,
        courses_progress (
          id,
          course_id,
          owner_id,
          progress
        )
      `
      )
      .eq('id', user!.id)
      .single();

    id.push(...res.data!.courses_progress.map((course) => course.course_id));
  }

  const data = await sanityFetch<ProductCard[]>({
    query: /* groq */ ` 
        *[_type == "course" && basis == $basis && !(_id in $id)][0...3] {
          ${PRODUCT_CARD_QUERY}
        }
      `,
    params: {
      basis,
      id,
    },
  });

  if (data.length === 0) return null;

  return (
    <section className={styles['RelatedProducts']}>
      <h2 className={styles['title']} dangerouslySetInnerHTML={{ __html: title }} />
      <p className={styles['text']} dangerouslySetInnerHTML={{ __html: text }} />
      <div className={styles['grid']}>
        {data.map((course) => (
          <Card
            key={course._id}
            data={course}
            tabletHorizontal={true}
          />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
