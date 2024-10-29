import CertificateHero from '@/components/_dashboard/CertificateHero';
import CertificateSection from '@/components/_dashboard/CertificateSection';
import NotesSection from '@/components/_dashboard/NotesSection';
import SuggestedCourses from '@/components/_dashboard/SuggestedCourses';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import { PRODUCT_CARD_QUERY } from '@/global/constants';
import type { CoursesProgress } from '@/global/types';
import getCourseCompletionPercentage from '@/utils/get-course-completion-percentage';
import mapNotes, { QueryProps } from '@/utils/map-note';
import sanityFetch from '@/utils/sanity.fetch';
import { createClient } from '@/utils/supabase-server';
import { notFound } from 'next/navigation';

export default async function Certificate({ params: { courseSlug } }: { params: { courseSlug: string } }) {
  const { course, course_progress, suggestedCourse, full_name, notes, notesSum, authorName }: QueryProps =
    await query(courseSlug);

  const completionPercentage = getCourseCompletionPercentage(course_progress);

  if (completionPercentage < 100) return notFound();

  return (
    <div>
      <CertificateHero />
      <CertificateSection
        course={course}
        full_name={full_name}
        authorName={authorName}
      />
      {notesSum != 0 && (
        <NotesSection
          notes={notes}
          courseName={course.name}
          notesSum={notesSum}
        />
      )}
      <SuggestedCourses
        heading='Czujesz **niedosyt**?'
        paragraph='Wybraliśmy dla Ciebie kurs, dzięki któremu Twoje umiejętności wskoczą na **wyższy poziom!**'
        course={suggestedCourse}
      />
    </div>
  );
}

export async function generateMetadata({ params: { courseSlug } }: { params: { courseSlug: string } }) {
  return await QueryMetadata('course', `/moje-konto/kursy/${courseSlug}/certyfikat`, courseSlug);
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
    .returns<{ id: string; firstName: string; courses_progress: CoursesProgress[] }[]>()
    .single();

  const ownedCourses = res.data?.courses_progress.map((el) => el.course_id);
  ownedCourses ?? notFound();

  const data: QueryProps = await sanityFetch({
    query: /* groq */ `
    {
      "course": *[_type == "course" && slug.current == $slug][0]{
        _id,
        name,
        author -> {
          name,
          surname
        },
        "slug": slug.current,
        chapters[] {
          chapterName,
          lessons[]-> {
            _id,
            name,
            title
          },
        },
      },
      "suggestedCourse": *[_type=="course" && visible == true  && !(course->_id in $courses)][0]{
        ${PRODUCT_CARD_QUERY}
      }
    }`,
    tags: ['course'],
    params: {
      slug: slug,
      courses: ownedCourses,
    },
  });

  if (!res.data!.courses_progress.some((el) => el.course_id === data.course._id)) return notFound();

  const course_progress = res.data!.courses_progress.find((el) => el.course_id === data.course._id)!;

  const notes = mapNotes(course_progress, data.course);

  return {
    course: data.course,
    course_progress,
    suggestedCourse: data.suggestedCourse,
    full_name: res.data!.firstName,
    notes,
    notesSum: sumNotesCharacters(notes),
    authorName: `${data.course.author.name || ''} ${data.course.author.surname || ''}`,
  };
};

function sumNotesCharacters(notes: QueryProps['notes']) {
  let sum = 0;

  for (const note of notes) {
    for (const lesson of note.lessons) {
      sum += lesson.notes.length;
    }
  }

  return sum;
}
