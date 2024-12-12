import Components, { Components_Query } from '@/components/Components';
import { CtaHeading_Query } from '@/components/_courseDiscount/CtaHeading';
import { DiscountCta_Query } from '@/components/_courseDiscount/DiscountCta';
import { DiscountHero_Query } from '@/components/_courseDiscount/DiscountHero';
import { ImageHeading_Query } from '@/components/_courseDiscount/ImageHeading';
import SectionPicker from '@/components/_courseDiscount/SectionPicker';
import { TimerBox_Query } from '@/components/_courseDiscount/TimerBox';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import type { ThankYouPageQueryProps } from '@/global/types';
import sanityFetch from '@/utils/sanity.fetch';
import { notFound } from 'next/navigation';

const LandingPage = async ({ params: { slug, thankYouSlug } }: { params: { slug: string; thankYouSlug: string } }) => {
  const { name, hasDiscount, content, discountComponents }: ThankYouPageQueryProps = await query(thankYouSlug);

  console.log(discountComponents);

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
      {hasDiscount ? <SectionPicker /> : <Components data={content} />}
    </>
  );
};

export default LandingPage;

export async function generateMetadata({
  params: { slug: paramsSlug, thankYouSlug: paramsThankYouSlug },
}: {
  params: { slug: string; thankYouSlug: string };
}) {
  return await QueryMetadata('thankYouPage', `/landing/${paramsSlug}/${paramsThankYouSlug}`, paramsThankYouSlug);
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
          discount -> {
            basis,
            name,
            'slug': slug.current,
          }
        },
        discountComponents[] { 
          heading, 
          paragraph,
          image,
          ctaText,
          additionalText,
          additionalParagraph,
          },
        

      }
    `,
    params: { slug },
    tags: ['landingPage'],
  });
  !data && notFound();
  return data as ThankYouPageQueryProps;
};
