import EmptyCourses from '@/components/_dashboard/EmptyCourses';
import ListingCourses from '@/components/_dashboard/ListingCourses';
import { Img_Query } from '@/components/ui/image';
import Seo from '@/global/Seo';
import type { ImgType } from '@/global/types';
import sanityFetch from '@/utils/sanity.fetch';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

type QueryProps = {
  global: {
    image_knitting: ImgType;
    image_crochet: ImgType;
  };
  courses: {
    _id: string;
    name: string;
    slug: string;
    image: ImgType;
    complexity: 1 | 2 | 3;
    courseLength: string;
    progressPercentage: number;
  }[];
};

export default async function Courses() {
  const { global, courses }: QueryProps = await query();

  return (
    <div>
      {courses.length > 0 ? (
        <ListingCourses courses={courses} />
      ) : (
        <EmptyCourses
          image_crochet={global.image_crochet}
          image_knitting={global.image_knitting}
        />
      )}
    </div>
  );
}

export async function generateMetadata() {
  return Seo({
    title: 'Moje kursy | Kierunek dzierganie',
    path: '/moje-konto/kursy',
  });
}

const query = async (): Promise<QueryProps> => {
  const supabase = createServerActionClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  const data = await sanityFetch<QueryProps>({
    query: /* groq */ ` {
      "global":  *[_id == 'global'][0] {
        image_crochet {
          asset -> {
            url,
            altText,
            metadata {
              lqip,
              dimensions {
                width,
                height,
              },
            },
          },
        },
        image_knitting {
          ${Img_Query}
        },
      },
      "courses": *[_type == "course" && _id in $id] {
        _id,
        name,
        "slug": slug.current,
        complexity,
        courseLength,
        image {
          ${Img_Query}
        },
      },
    }`,
    params: {
      id: res.data!.courses_progress.map((course) => course.course_id),
    },
  });

  return {
    ...data,
    courses: data.courses.map((course) => {
      const progress = res.data!.courses_progress.find((el) => el.course_id === course._id)!;

      let totalLessons = 0;
      let completedLessons = 0;

      for (const sectionId in progress.progress) {
        const lessons = progress.progress[sectionId];
        for (const lessonId in lessons) {
          totalLessons++;
          if (lessons[lessonId]!.ended) {
            completedLessons++;
          }
        }
      }

      // if 0 lessons, return to avoid division by 0
      if (totalLessons === 0) {
        return { ...course, progressPercentage: 100 };
      }

      const completionPercentage = (completedLessons / totalLessons) * 100;

      return { ...course, progressPercentage: completionPercentage };
    }),
  };
};
