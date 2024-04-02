import LessonDescription from '@/components/_dashboard/LessonDescription';
import LessonHero from '@/components/_dashboard/LessonHero';
import LessonNotes from '@/components/_dashboard/LessonNotes';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import type { Chapter, File, ImgType } from '@/global/types';
import sanityFetch from '@/utils/sanity.fetch';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

type QueryProps = {
  course: {
    _id: string;
    name: string;
    slug: string;
    chapters: Chapter[];
  };
  lesson: {
    _id: string;
    name: string;
    title: string;
    slug: string;
    video: string;
    lengthInMinutes: number;
    files: File[];
    description: string;
    flex: {
      title: string;
      description: string;
      img: ImgType;
    }[];
    files_alter: File[];
  };
};

type SupabaseData = {
  data: {
    courses_progress: {
      id: number;
      course_id: string;
      owner_id: string;
      progress: {
        [key: string]: {
          [key: string]: {
            ended: boolean;
            notes: string;
          };
        };
      };
    }[];
  };
};

export default async function Course({
  params: { lessonSlug, courseSlug },
}: {
  params: { courseSlug: string; lessonSlug: string };
}) {
  const {
    course,
    lesson,
    courses_progress,
  }: QueryProps & { courses_progress: SupabaseData['data']['courses_progress'][0] } = await query(
    courseSlug,
    lessonSlug
  );

  const currentChapterInfo = (() => {
    let currentChapter = course.chapters[0]!;
    let isFindChapter = false;
    let currentChapterIndex = 0;
    let currentLessonIndex = 0;

    course.chapters.every((chapter) => {
      chapter.lessons.forEach((currentLesson) => {
        if (currentLesson._id === lesson._id) {
          currentChapter = chapter;
          isFindChapter = true;
        }
      });
      return !isFindChapter;
    });

    course.chapters.every((chapter, i) => {
      if (chapter.chapterName === currentChapter.chapterName) currentChapterIndex = i;
      return !currentChapterIndex;
    });

    currentChapter.lessons.every((currentLesson, i) => {
      if (currentLesson._id === lesson._id) currentLessonIndex = i;
      return !currentLessonIndex;
    });

    return { currentChapter, currentChapterIndex, currentLessonIndex };
  })();

  return (
    <>
      <Breadcrumbs
        data={[
          { name: 'Moje kursy', path: '/moje-konto/kursy' },
          { name: course.name, path: `/moje-konto/kursy/${course.slug}` },
          { name: lesson.title, path: `/moje-konto/kursy/${course.slug}/${lesson.slug}` },
        ]}
      />
      <LessonHero
        course={course}
        lesson={lesson}
        currentChapter={currentChapterInfo.currentChapter}
        currentChapterIndex={currentChapterInfo.currentChapterIndex}
        currentLessonIndex={currentChapterInfo.currentLessonIndex}
        progress={courses_progress}
      />
      <LessonNotes
        progress={courses_progress}
        currentChapter={currentChapterInfo.currentChapter}
        currentLessonIndex={currentChapterInfo.currentLessonIndex}
      />
      <LessonDescription lesson={lesson} />
    </>
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
    "lesson": *[_type == "lesson" && slug.current == $lessonSlug][0]{
      _id,
      name,
      title,
      "slug": slug.current,
      video,
      lengthInMinutes,
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
      description,
      flex[]{
        title,
        description,
        img{
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
        }
      }
    },
    "course": *[_type == "course" && slug.current == $courseSlug][0]{
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
          title,
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
  });

  if (!(res as SupabaseData).data.courses_progress.some((el) => el.course_id === data?.course._id)) return notFound();

  if (!data.lesson) return notFound();

  return {
    ...data,
    courses_progress: (res as SupabaseData).data.courses_progress.find((el) => el.course_id === data.course._id)!,
  };
};
