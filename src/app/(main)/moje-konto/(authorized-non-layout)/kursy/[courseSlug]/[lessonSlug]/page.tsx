import LessonHero from '@/components/_dashboard/LessonHero';
import type { ImgType } from '@/global/types';
import sanityFetch from '@/utils/sanity.fetch';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { draftMode, cookies } from 'next/headers';
import { notFound } from 'next/navigation';

interface QueryProps {
  course: {
    _id: string;
    name: string;
    slug: string;
    chapters: {
      chapterDescription: string;
      chapterName: string;
      chapterImage: ImgType;
      lessons: {
        _id: string;
        name: string;
        video: string;
        lengthInMinutes: number;
        slug: string;
      }[];
    }[];
  };
  lesson: {
    _id: string;
    name: string;
    slug: string;
    video: string;
    lengthInMinutes: number;
  };
}

type SupabaseData = {
  data: {
    courses_progress: {
      course_id: string;
      owner_id: string;
    }[];
  };
};

export default async function Course({
  params: { lessonSlug, courseSlug },
}: {
  params: { courseSlug: string; lessonSlug: string };
}) {
  const { course, lesson, courses_progress }: QueryProps & SupabaseData['data'] = await query(courseSlug, lessonSlug);
  return (
    <div>
      <LessonHero
        course={course}
        lesson={lesson}
        progress={courses_progress.find((el) => el.course_id === course._id)!}
      />
    </div>
  );
}

const query = async (courseSlug: string, lessonSlug: string) => {
  const supabase = createServerActionClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const res: unknown = await supabase
    .from('profiles')
    .select(
      `
        id, 
        courses_progress (
          course_id,
          owner_id
        )
      `
    )
    .eq('id', user!.id)
    .single();

  const data: QueryProps = await sanityFetch({
    query: /* groq */ `
    {
    "lesson": *[_type == "lesson" && slug.current == $lessonSlug][0]{
      _id,
      name,
      "slug": slug.current,
      video,
      lengthInMinutes,
    },
    "course": *[_type == "course" && slug.current == $courseSlug][0]{
      _id,
      name,
      "slug": slug.current,
      chapters {
        chapterImage {
          asset -> {
            url,
            altText,
            metadata {
              lqip,
              dimensions {
                width,
                height,
              }
            }
          }
        }, 
        chapterDescription,
        chapterName,
        lessons[]->{
          _id,  
          name,
          video,
          lengthInMinutes,
          "slug": slug.current
        }
      }[],
      image {
        asset -> {
        url,
        altText,
        metadata {
            lqip,
            dimensions {
              width,
              height,
            }
          }
        }
      },
    }
    }`,
    params: {
      lessonSlug: lessonSlug,
      courseSlug: courseSlug,
    },
    isDraftMode: draftMode().isEnabled,
  });

  if (!(res as SupabaseData).data.courses_progress.some((el) => el.course_id === data?.course._id)) return notFound();

  if (!data.lesson) return notFound();

  return { ...data, ...(res as SupabaseData).data };
};
