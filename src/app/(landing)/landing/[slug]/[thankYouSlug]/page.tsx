import Components, { Components_Query } from '@/components/Components';
import { CtaHeading_Query } from '@/components/_courseDiscount/CtaHeading';
import { DiscountCta_Query } from '@/components/_courseDiscount/DiscountCta';
import { DiscountHero_Query } from '@/components/_courseDiscount/DiscountHero';
import { ImageHeading_Query } from '@/components/_courseDiscount/ImageHeading';
import SectionPicker from '@/components/_courseDiscount/SectionPicker';
import { TimerBox_Query } from '@/components/_courseDiscount/TimerBox';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import { Img_Query } from '@/components/ui/image';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import type { ThankYouPageQueryProps } from '@/global/types';
import { decodeEmail } from '@/utils/email-cipher';
import sanityFetch from '@/utils/sanity.fetch';
import { createClient } from '@/utils/supabase-admin';
import { notFound } from 'next/navigation';

const LandingPage = async ({
  params: { slug, thankYouSlug },
  searchParams: { subscriber, group },
}: {
  params: { slug: string; thankYouSlug: string };
  searchParams: { subscriber: string; group: string };
}) => {
  const { name, hasDiscount, content, discountCourse, discountComponents }: ThankYouPageQueryProps =
    await query(thankYouSlug);

  if ((!subscriber || !group) && hasDiscount) return notFound();

  const { data } = !hasDiscount ? { data: null } : await getDiscount(decodeEmail(subscriber), group);

  return (
    <>
      <Breadcrumbs
        data={[
          {
            name,
            path: `/landing/${slug}/${thankYouSlug}`,
          },
        ]}
        visible={false}
      />
      {hasDiscount ? (
        discountCourse ? (
          <SectionPicker
            data={discountComponents}
            discountCourse={discountCourse}
            discountCode={data?.code}
            expirationDate={data?.expiration_date}
          />
        ) : null
      ) : (
        <Components data={content} />
      )}
    </>
  );
};

export default LandingPage;

export async function generateMetadata({
  params: { slug: paramsSlug, thankYouSlug: paramsThankYouSlug },
}: {
  params: { slug: string; thankYouSlug: string };
}) {
  return await QueryMetadata('thankYouPage', `/landing/${paramsSlug}/${paramsThankYouSlug}`, paramsThankYouSlug, false);
}

const query = async (slug: string): Promise<ThankYouPageQueryProps> => {
  const data = await sanityFetch({
    query: /* groq */ `
      *[_type == "thankYouPage" && slug.current == $slug][0] {
        name,
        'slug': slug.current,
        hasDiscount,
        ${Components_Query}
        discountCourse{
          course -> {
            name,
            'slug': slug.current,
            _type,
            _id,
            basis,
            reviewsCount,
            rating,
            discount,
            price,
            'image': gallery[0]{
              ${Img_Query}
            },
          },
          discount,
          discountTime,
        },
        discountComponents[] { 
          _type,
          ${DiscountHero_Query},
          ${DiscountCta_Query},
          ${CtaHeading_Query},
          ${ImageHeading_Query},
          ${TimerBox_Query},
          },
        

      }
    `,
    params: { slug },
    tags: ['landingPage'],
  });
  !data && notFound();
  return data as ThankYouPageQueryProps;
};

const getDiscount = async (subscriber: string, group: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .containedBy('course_discount_data', {
      email: subscriber,
      group_id: group,
    })
    .single();

  return { data, error };
};
