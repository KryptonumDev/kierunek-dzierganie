import CertificateHero from '@/components/_dashboard/CertificateHero';
import CertificateSection from '@/components/_dashboard/CertificateSection';
import SuggestedCourses, {
  SuggestedCoursesTypes,
  SuggestedCourses_Query,
} from '@/components/_dashboard/SuggestedCourses';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import type { CoursesProgress } from '@/global/types';
import sanityFetch from '@/utils/sanity.fetch';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

interface QueryProps {
  course: {
    _id: string;
    name: string;
    slug: string;
  };
  courses_progress: CoursesProgress;
  suggestedCourses: SuggestedCoursesTypes['courses'];
  full_name: string;
}

export default async function Certificate({ params: { courseSlug } }: { params: { courseSlug: string } }) {
  const { course, courses_progress, suggestedCourses, full_name }: QueryProps = await query(courseSlug);

  const completionPercentage = (() => {
    let totalLessons = 0;
    let completedLessons = 0;

    for (const sectionId in courses_progress.progress) {
      const lessons = courses_progress.progress[sectionId];
      for (const lessonId in lessons) {
        totalLessons++;
        if (lessons[lessonId]!.ended) {
          completedLessons++;
        }
      }
    }

    // if 0 lessons, return to avoid division by 0
    if (totalLessons === 0) {
      return 0;
    }

    const completionPercentage = (completedLessons / totalLessons) * 100;
    return completionPercentage;
  })();

  if (completionPercentage < 100) return notFound();

  return (
    <div>
      <CertificateHero />
      <CertificateSection
        course={course}
        full_name={full_name}
      />
      <SuggestedCourses
        heading='Czujesz **niedosyt**?'
        paragraph='Wybraliśmy dla Ciebie kurs, dzięki któremu Twoje umiejętności wskoczą na **wyższy poziom!**'
        courses={suggestedCourses}
      />
    </div>
  );
}

export async function generateMetadata({ params: { courseSlug } }: { params: { courseSlug: string } }) {
  return await QueryMetadata('course', `/moje-konto/kursy/${courseSlug}/certyfikat`, courseSlug);
}

const query = async (slug: string): Promise<QueryProps> => {
  const supabase = createServerActionClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const res = await supabase
    .from('profiles')
    .select(
      `
        id,
        full_name,
        courses_progress (
          id,
          course_id,
          owner_id,
          progress
        )
      `
    )
    .eq('id', user!.id)
    .returns<{ id: string; full_name: string; courses_progress: CoursesProgress[] }[]>()
    .single();

  const ownedCourses = res.data?.courses_progress.map((el) => el.course_id);

  const data: QueryProps = await sanityFetch({
    query: /* groq */ `
    {
      "course": *[_type == "course" && slug.current == $slug][0]{
        _id,
        name,
        "slug": slug.current,
      },
      ${SuggestedCourses_Query}
    }`,
    params: {
      slug: slug,
      courses: ownedCourses,
    },
  });

  if (!res.data!.courses_progress.some((el) => el.course_id === data.course._id)) return notFound();

  return {
    course: data.course,
    courses_progress: res.data!.courses_progress.find((el) => el.course_id === data.course._id)!,
    suggestedCourses: data.suggestedCourses,
    full_name: res.data!.full_name,
  };
};
