import { draftMode } from 'next/headers';
import sanityFetch from '@/utils/sanity.fetch';
import Seo from '@/global/Seo';
import type { generateMetadataProps } from '@/global/types';

const LandingPage = async () => {
  return (
    <>
      <h1>Homepage</h1>
      <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptas praesentium vero sapiente voluptatum, non nobis aperiam architecto ab consectetur impedit quae sunt? Quidem, esse dolores. Consectetur doloremque laborum voluptates earum repellat officiis obcaecati non deleniti consequuntur facilis magnam facere tenetur deserunt nam fugit molestiae, explicabo assumenda tempore tempora? Impedit dolorem mollitia exercitationem beatae, facere aliquam excepturi perferendis consequatur consectetur veritatis animi quas eum sed debitis repellat rem soluta similique voluptas eius dicta ipsa hic distinctio nemo? Inventore deleniti beatae error! Excepturi id amet fugit maxime est doloribus tenetur beatae eum harum eveniet nemo, aliquam nulla in at. Saepe nostrum eveniet iste harum quam porro deserunt odit a eos vel beatae, maiores non neque nihil voluptatem, exercitationem incidunt ab? Voluptas, deleniti voluptates temporibus porro nostrum obcaecati dignissimos corporis, fugiat expedita ipsum alias exercitationem eius, modi laboriosam sapiente sed. Ipsam blanditiis itaque inventore error unde nemo minima. Culpa temporibus consequuntur ullam, ipsa eaque quos odio suscipit animi! Quia, labore. Neque necessitatibus distinctio omnis aut exercitationem illum vitae eveniet consequatur, quo tenetur architecto ratione voluptas aspernatur recusandae mollitia eum sint. Fugit quae natus minus vero fuga, quaerat, maiores officiis iure velit officia reprehenderit adipisci numquam, eum totam sint quisquam molestias dolor illo mollitia.</p>
    </>
  );
};

export async function generateMetadata() {
  const { seo: { title, description } } = (await query()) as generateMetadataProps;
  return Seo({
    title,
    description,
    path: '/',
  });
}

const query = async () => {
  const data = await sanityFetch({
    query: /* groq */ `
      *[_type == "landingPage"][0] {
        name,
        seo {
          title,
          description,
        }
      }`,
    isDraftMode: draftMode().isEnabled
  });
  return data;
};

export default LandingPage;