import CourseChapters from '@/components/_dashboard/CourseChapters';
import type { ImgType, CoursesProgress } from '@/global/types';
import sanityFetch from '@/utils/sanity.fetch';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

interface QueryProps {
  course: {
    _id: string;
    name: string;
    slug: string;
    chapters: {
      _id: string;
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
}

type SupabaseData = {
  data: {
    courses_progress: CoursesProgress[];
  };
};

export default async function Course({ params: { courseSlug } }: { params: { courseSlug: string } }) {
  const { course, courses_progress }: QueryProps & { courses_progress: CoursesProgress } = await query(courseSlug);
  return (
    <div>
      <CourseChapters
        courses_progress={courses_progress}
        course={course}
      />
    </div>
  );
}

const query = async (slug: string): Promise<QueryProps & { courses_progress: CoursesProgress }> => {
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
          owner_id,
          progress
        )
      `
    )
    .eq('id', user!.id)
    .single();

  const data: QueryProps = await sanityFetch({
    query: /* groq */ `
    {
    "course": *[_type == "course" && slug.current == $slug][0]{
      _id,
      name,
      "slug": slug.current,
      chapters {
        "_id": _key,
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
      slug: slug,
    },
  });

  if (!(res as SupabaseData).data.courses_progress.some((el) => el.course_id === data.course._id)) return notFound();

  return {
    course: data.course,
    courses_progress: (res as SupabaseData).data.courses_progress.find((el) => el.course_id === data.course._id)!,
  };
};
