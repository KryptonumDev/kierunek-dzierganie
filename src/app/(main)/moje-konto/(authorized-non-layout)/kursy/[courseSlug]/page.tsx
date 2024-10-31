import CourseChapters from '@/components/_dashboard/CourseChapters';
import ProgramChapters from '@/components/_dashboard/ProgramChapters';
import RelatedFiles from '@/components/_dashboard/RelatedFiles';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import type { Course, CoursesProgress, File } from '@/global/types';
import { checkCourseProgress } from '@/utils/check-course-progress';
import type { QueryProps as MapNotesQueryProps } from '@/utils/map-note';
import mapNotes from '@/utils/map-note';
import sanityFetch from '@/utils/sanity.fetch';
import { createClient } from '@/utils/supabase-server';
import { notFound } from 'next/navigation';

interface QueryProps {
  course: Course & {
    files: File[];
    files_alter: File[];
    author: {
      name: string;
      surname: string;
    };
    chapters: {
      chapterName: string;
      lessons: {
        name: string;
        _id: string;
        title: string;
      }[];
    }[];
  };
  courses_progress: CoursesProgress;
  left_handed: boolean;
  notes: {
    chapterName: string;
    lessons: {
      name: string;
      notes: string;
    }[];
  }[];
  full_name: string;
  authorName: string;
}

export default async function Course({ params: { courseSlug } }: { params: { courseSlug: string } }) {
  const { course, courses_progress, left_handed, notes, full_name, authorName }: QueryProps = await query(courseSlug);

  console.log(course.files);

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
      <RelatedFiles
        courses_progress={courses_progress}
        course={course}
        left_handed={left_handed}
        notes={notes}
        full_name={full_name}
        authorName={authorName}
      />
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
        left_handed,
        billing_data->firstName,
        courses_progress (
          id,
          course_id,
          owner_id,
          progress
        )
      `
    )
    .eq('id', user!.id)
    .returns<{ id: string; firstName: string; left_handed: boolean; courses_progress: CoursesProgress[] }[]>()
    .single();

  const data: QueryProps = await sanityFetch({
    query: /* groq */ `
    {
      "course": *[_type == "course" && slug.current == $slug][0]{
        _id,
        name,
        type,
        author -> {
          name,
          surname
        },
        files[]{
          asset->{
            url,
            size,
            originalFilename,
            _id
          }
          },
        files_alter[]{
          asset->{
            url,
            size,
            originalFilename,
            _id
            }
          },
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
            title,
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

  const course_progress = res.data!.courses_progress.find((el) => el.course_id === data.course._id)!;

  const notes = mapNotes(course_progress, data.course as unknown as MapNotesQueryProps['course']);

  const progress = await checkCourseProgress(
    data.course,
    res.data!.courses_progress.find((el) => el.course_id === data.course._id)!
  );

  return {
    course: data.course,
    left_handed: res.data!.left_handed,
    courses_progress: progress,
    full_name: res.data!.firstName,
    notes,
    authorName: `${data.course.author.name || ''} ${data.course.author.surname || ''}`,
  };
};
