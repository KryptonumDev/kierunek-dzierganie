import EmptyCourses from '@/components/_dashboard/EmptyCourses';
import ListingCourses from '@/components/_dashboard/ListingCourses';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import { Img_Query } from '@/components/ui/image';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import type { Complexity, ImgType } from '@/global/types';
import sanityFetch from '@/utils/sanity.fetch';
import { createClient } from '@/utils/supabase-server';

const currentUrl = '/moje-konto/kursy';
const page = [{ name: 'Moje kursy', path: currentUrl }];

type QueryProps = {
  lastWatchedCourse: string;
  lastWatchedList: string[];
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
    progressId: string;
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
    progressId: string;
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
  const { global, courses, lastWatchedCourse, lastWatchedList, categories, authors, totalCourses }: QueryProps =
    await query(searchParams);

  const sort = searchParams.sortowanie ?? null;

  return (
    <div>
      <Breadcrumbs
        visible={false}
        data={page}
      />
      {courses.length > 0 || Object.keys(searchParams).length > 0 ? (
        <ListingCourses
          totalCourses={totalCourses}
          lastWatchedCourse={lastWatchedCourse}
          courses={courses}
          categories={categories}
          authors={authors}
          lastWatchedList={lastWatchedList}
          sort={sort}
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
  return await QueryMetadata('Courses_Page', currentUrl);
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
        last_watched_list,
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
    tags: ['global', 'course', 'courseCategory', 'CourseAuthor_Collection'],
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
    lastWatchedList: res.data!.last_watched_list,
    lastWatchedCourse: res.data!.last_watched_course,
    courses: data.courses
      .concat(data.lastWatched)
      .filter((el) => el)
      .map((course) => {
        const progress = res.data!.courses_progress.find((el) => el.course_id === course._id)!;
        const progressId = res.data!.courses_progress.find((el) => el.course_id === course._id)?.id;

        if (!progress)
          return {
            ...course,
            progressId,
            progressPercentage: 0,
          };

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
        if (totalLessons === 0)
          return {
            ...course,
            progressPercentage: 0,
            progressId,
          };

        const completionPercentage = (completedLessons / totalLessons) * 100;

        return { ...course, progressPercentage: completionPercentage, progressId };
      }),
  };
};
