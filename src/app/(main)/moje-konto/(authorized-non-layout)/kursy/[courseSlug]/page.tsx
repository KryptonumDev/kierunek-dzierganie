import CourseChapters from '@/components/_dashboard/CourseChapters';
import ProgramChapters from '@/components/_dashboard/ProgramChapters';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import type { CoursesProgress, Course } from '@/global/types';
import { checkCourseProgress } from '@/utils/check-course-progress';
import sanityFetch from '@/utils/sanity.fetch';
import { createClient } from '@/utils/supabase-server';
import { notFound } from 'next/navigation';

interface QueryProps {
  course: Course;
  courses_progress: CoursesProgress;
}

export default async function Course({ params: { courseSlug } }: { params: { courseSlug: string } }) {
  const { course, courses_progress }: QueryProps = await query(courseSlug);
  return (
    <div>
      {course.type === 'course' ? (
        <CourseChapters
          courses_progress={courses_progress}
          course={course}
        />
      ) : (
        <ProgramChapters
          courses_progress={courses_progress}
          course={course}
        />
      )}
    </div>
  );
}

export async function generateMetadata({ params: { courseSlug } }: { params: { courseSlug: string } }) {
  return await QueryMetadata('course', `/moje-konto/kursy/${courseSlug}`, courseSlug);
}

const query = async (slug: string): Promise<QueryProps> => {
  const supabase = createClient();

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

  const data: QueryProps = await sanityFetch({
    query: /* groq */ `
    {
      "course": *[_type == "course" && slug.current == $slug][0]{
        _id,
        name,
        type,
        "slug": slug.current,
        chapters {
          dateOfUnlock,
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
    tags: ['course'],
    params: {
      slug: slug,
    },
  });

  if (!res.data!.courses_progress.some((el) => el.course_id === data.course._id)) return notFound();

  const progress = await checkCourseProgress(
    data.course,
    res.data!.courses_progress.find((el) => el.course_id === data.course._id)!
  );

  return {
    course: data.course,
    courses_progress: progress,
  };
};
