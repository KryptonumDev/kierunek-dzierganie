import EmptyCourses from '@/components/_dashboard/EmptyCourses';
import ListingCourses from '@/components/_dashboard/ListingCourses';
import { Img_Query } from '@/components/ui/image';
import Seo from '@/global/Seo';
import type { Complexity, ImgType } from '@/global/types';
import sanityFetch from '@/utils/sanity.fetch';
import { createClient } from '@/utils/supabase-server';

type QueryProps = {
  lastWatchedCourse: string;
  totalCourses: number;
  global: {
    image_knitting: ImgType;
    image_crochet: ImgType;
  };
  lastWatched: {
    _id: string;
    name: string;
    slug: string;
    image: ImgType;
    complexity: Complexity;
    progressPercentage: number;
    courseLength: string;
    excerpt: string;
  };
  courses: {
    _id: string;
    name: string;
    slug: string;
    image: ImgType;
    complexity: Complexity;
    courseLength: string;
    progressPercentage: number;
    excerpt: string;
  }[];
  categories: {
    name: string;
    slug: string;
    _id: string;
  }[];
  authors: {
    name: string;
    slug: string;
    _id: string;
  }[];
};

export default async function Courses({ searchParams }: { searchParams: { [key: string]: string } }) {
  const { global, courses, lastWatchedCourse, categories, authors, totalCourses }: QueryProps =
    await query(searchParams);

  return (
    <div>
      {courses.length > 0 || Object.keys(searchParams).length > 0 ? (
        <ListingCourses
          totalCourses={totalCourses}
          lastWatchedCourse={lastWatchedCourse}
          courses={courses}
          categories={categories}
          authors={authors}
        />
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

const query = async (searchParams: { [key: string]: string }): Promise<QueryProps> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const res = await supabase
    .from('profiles')
    .select(
      `
        id,
        last_watched_course,
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
      "courses": *[
        _type == "course" 
          && _id in $id
          && (!defined($category) || category->slug.current == $category)
          && (!defined($complexity) || complexity == $complexity)
          && (!defined($author) || author->slug.current == $author)
          && (!defined($type) || basis == $type)
        ] {
        _id,
        name,
        "slug": slug.current,
        complexity,
        courseLength,
        excerpt,
        "image": gallery {
          ${Img_Query}
        }[0],
      },
      'totalCourses': count(*[_type == "course"&& _id in $totalCourses]),
      "lastWatched": *[_type == "course" && _id == $last_watched_course] {
        _id,
        name,
        "slug": slug.current,
        complexity,
        courseLength,
        excerpt,
        "image": gallery {
          ${Img_Query}
        }[0],
      }[0],
      "categories": *[_type == 'courseCategory'][]{
        name,
        "slug": slug.current,
        _id
      },
      "authors": *[_type == 'CourseAuthor_Collection'][]{
        name,
        "slug": slug.current,
        _id
      }
    }`,
    params: {
      totalCourses: res.data!.courses_progress.map((course) => course.course_id),
      id: res
        .data!.courses_progress.filter((el) => el.course_id !== res.data!.last_watched_course)
        .map((course) => course.course_id),
      last_watched_course: res.data!.last_watched_course,
      category: searchParams.rodzaj ?? null,
      complexity: searchParams['poziom-trudnosci'] ?? null,
      author: searchParams.autor ?? null,
      type: searchParams.kategoria ?? null,
    },
  });

  return {
    ...data,
    lastWatchedCourse: res.data!.last_watched_course,
    courses: data.courses.concat(data.lastWatched).map((course) => {
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
        return {
          ...course,
          progressPercentage: 0,
        };
      }

      const completionPercentage = (completedLessons / totalLessons) * 100;

      return { ...course, progressPercentage: completionPercentage };
    }),
  };
};
