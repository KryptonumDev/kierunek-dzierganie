import CourseChapters from '@/components/_dashboard/CourseChapters';
import type { ImgType } from '@/global/types';
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
      chapterDescription: string;
      chapterName: string;
      chapterImage: ImgType;
      lessons: {
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
    courses_progress: {
      course_id: string;
      owner_id: string;
    }[];
  };
};

export default async function Course({ params: { courseSlug } }: { params: { courseSlug: string } }) {
  const { course }: QueryProps = await query(courseSlug);
  return (
    <div>
      <CourseChapters course={course} />
    </div>
  );
}

const query = async (slug: string): Promise<QueryProps> => {
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
    "course": *[_type == "course" && slug.current == $slug][0]{
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

  return data;
};
