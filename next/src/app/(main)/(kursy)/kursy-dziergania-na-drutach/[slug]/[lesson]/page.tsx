import { notFound } from 'next/navigation';
import sanityFetch from '@/utils/sanity.fetch';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import type { generateLessonStaticParamsProps } from '@/global/types';
import { createClient } from '@/utils/supabase-server';
import PreviewLesson, { type PreviewLessonTypes } from '@/components/_product/PreviewLesson';
import Reviews from '@/components/_product/Reviews';
import { cookies } from 'next/headers';

const Course = async ({ params: { slug, lesson: lessonSlug } }: { params: { slug: string; lesson: string } }) => {
  const { course, lesson } = await query(slug, lessonSlug);

  const alreadySubscribed = course.previewGroupMailerLite ? !!cookies().get(course.previewGroupMailerLite) : false;

  return (
    <>
      <Breadcrumbs
        data={[
          {
            name: 'Dzierganie',
            path: '/kursy-dziergania-na-drutach',
          },
          {
            name: course.name,
            path: `/kursy-dziergania-na-drutach/${slug}`,
          },
          {
            name: 'Podgląd kursu',
            path: `/kursy-dziergania-na-drutach/${slug}/${lesson}`,
          },
        ]}
        visible={true}
      />
      <PreviewLesson
        course={course}
        lesson={lesson}
        alreadySubscribed={alreadySubscribed}
      />
      <Reviews
        user={''}
        alreadyBought={false}
        reviews={course.reviews}
        course={true}
        product={{
          id: course._id,
          type: 'course',
        }}
      />
    </>
  );
};

export default Course;

const query = async (slug: string, lesson: string): Promise<PreviewLessonTypes> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const id = [];

  const res = await supabase
    .from('profiles')
    .select(
      `
        id,
        billing_data->firstName,
        courses_progress (
          id,
          course_id,
          owner_id,
          progress
        )
      `
    )
    .eq('id', user?.id)
    .single();

  if (res.data?.courses_progress) {
    id.push(...res.data!.courses_progress.map((course) => course.course_id));
  }

  const data: PreviewLessonTypes = await sanityFetch({
    query: /* groq */ `
    {
    "lesson": *[_type == "lesson" && slug.current == $lessonSlug][0]{
      _id,
      title,
      "slug": slug.current,
      video,
      "videoProvider": select(
        videoProvider == "youtube" => "youtube",
        videoProvider == "bunnyNet" => "bunnyNet",
        "vimeo"
      ),
    },
    "course": *[_type == "course" && slug.current == $courseSlug][0]{
      _id,
      name,
      "slug": slug.current,
      libraryId,
      libraryApiKey,
      previewGroupMailerLite,
      previewLessons[] -> {
        "slug": slug.current,
        title,
      },
      "reviews": *[_type == 'productReviewCollection' && visible == true && references(^._id)][0...10]{
        rating,
        review,
        nameOfReviewer,
        _id
      },
    }
    }`,
    tags: ['lesson', 'course'],
    params: {
      lessonSlug: lesson,
      courseSlug: slug,
    },
  });

  !data?.course?._id && notFound();
  !data?.lesson?._id && notFound();
  return data;
};

export async function generateMetadata({ params: { slug, lesson } }: { params: { slug: string; lesson: string } }) {
  return await QueryMetadata(['course', 'lesson'], `/kursy-dziergania-na-drutach/${slug}/${lesson}`, lesson);
}

export async function generateStaticParams() {
  const data: generateLessonStaticParamsProps[] = await sanityFetch({
    query: /* groq */ `
      *[_type == 'course' && basis == 'knitting'] {
        'slug': slug.current,
        previewLessons[]->{
          'slug': slug.current,
        }
      }
    `,
  });

  return data
    .filter((el) => el.previewLessons?.length > 0)
    .flatMap(({ previewLessons, slug }) =>
      previewLessons.map(({ slug: lesson }) => ({
        slug,
        lesson,
      }))
    );
}
