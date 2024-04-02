import CertificateHero from '@/components/_dashboard/CertificateHero';
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
}

export default async function Certificate({ params: { courseSlug } }: { params: { courseSlug: string } }) {
  const {
    // course,
    courses_progress,
  }: QueryProps = await query(courseSlug);

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
    </div>
  );
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
        courses_progress (
          id,
          course_id,
          owner_id,
          progress
        )
      `
    )
    .eq('id', user!.id)
    .returns<{ id: string; courses_progress: CoursesProgress[] }[]>()
    .single();

  const data: QueryProps = await sanityFetch({
    query: /* groq */ `
    {
      "course": *[_type == "course" && slug.current == $slug][0]{
        _id,
        name,
        "slug": slug.current,
      }
    }`,
    params: {
      slug: slug,
    },
  });

  if (!res.data!.courses_progress.some((el) => el.course_id === data.course._id)) return notFound();

  return {
    course: data.course,
    courses_progress: res.data!.courses_progress.find((el) => el.course_id === data.course._id)!,
  };
};
