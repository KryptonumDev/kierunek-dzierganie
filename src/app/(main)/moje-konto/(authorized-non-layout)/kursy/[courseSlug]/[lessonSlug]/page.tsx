import LessonDescription from '@/components/_dashboard/LessonDescription';
import LessonHero from '@/components/_dashboard/LessonHero';
import LessonNotes from '@/components/_dashboard/LessonNotes';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import Seo from '@/global/Seo';
import type { Chapter, Course, CoursesProgress, File, ImgType } from '@/global/types';
import { checkCourseProgress } from '@/utils/check-course-progress';
import sanityFetch from '@/utils/sanity.fetch';
import { createClient } from '@/utils/supabase-server';
import { notFound } from 'next/navigation';

type QueryProps = {
  course: Course;
  lesson: {
    _id: string;
    name: string;
    title: string;
    slug: string;
    video: string;
    video_alter: string;
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
  courses_progress: SupabaseData['courses_progress'][0];
  left_handed: boolean;
  auto_play: boolean;
  id: string;
};

type SupabaseData = {
  id: string;
  left_handed: boolean;
  auto_play: boolean;
  courses_progress: CoursesProgress[];
};

export default async function Course({
  params: { lessonSlug, courseSlug },
}: {
  params: { courseSlug: string; lessonSlug: string };
}) {
  const { course, lesson, courses_progress, left_handed, id, auto_play }: QueryProps = await query(courseSlug, lessonSlug);

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
        id={id}
        left_handed={left_handed}
        auto_play={auto_play}
        course={course}
        lesson={lesson}
        currentChapter={currentChapterInfo.currentChapter as Chapter}
        currentChapterIndex={currentChapterInfo.currentChapterIndex}
        currentLessonIndex={currentChapterInfo.currentLessonIndex}
        progress={courses_progress}
      />
      <LessonNotes
        progress={courses_progress}
        currentChapter={currentChapterInfo.currentChapter as Chapter}
        currentLessonIndex={currentChapterInfo.currentLessonIndex}
      />
      <LessonDescription lesson={lesson} />
    </>
  );
}

export async function generateMetadata({
  params: { lessonSlug, courseSlug },
}: {
  params: { courseSlug: string; lessonSlug: string };
}) {
  const data: { lesson: { title: string } } = await sanityFetch({
    query: /* groq */ `
    {
      "lesson": *[_type == "lesson" && slug.current == $slug][0]{
        title,
      }
    }`,
    params: {
      slug: lessonSlug,
    },
  });

  return Seo({
    title: `${data.lesson.title} | Kierunek dzierganie`,
    path: `/moje-konto/kursy/${courseSlug}/${lessonSlug}`,
  });
}

const query = async (courseSlug: string, lessonSlug: string) => {
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
        auto_play,
        courses_progress (
          id,
          course_id,
          owner_id,
          progress
        )
      `
    )
    .eq('id', user!.id)
    .returns<SupabaseData[]>()
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
      video_alter,
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
        type,
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
            _id,
            title,
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

  if (!res.data?.courses_progress?.some((el) => el.course_id === data?.course._id)) return notFound();

  if (!data.lesson) return notFound();

  const progress = await checkCourseProgress(
    data.course,
    res.data!.courses_progress.find((el) => el.course_id === data.course._id)!
  );

  return {
    ...data,
    courses_progress: progress,
    left_handed: res.data.left_handed,
    auto_play: res.data.auto_play,
    id: user!.id,
  };
};
