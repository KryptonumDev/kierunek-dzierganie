import { Chapter, CoursesProgress, ProductCard } from '@/global/types';

export interface QueryProps {
  course: {
    _id: string;
    name: string;
    slug: string;
    author: {
      name: string;
      surname: string;
    };
    chapters: Chapter[];
  };
  course_progress: CoursesProgress;
  suggestedCourse: ProductCard;
  full_name: string;
  notes: {
    chapterName: string;
    lessons: {
      name: string;
      notes: string;
    }[];
  }[];
  notesSum: number;
  authorName: string;
}

export default function mapNotes(course_progress: CoursesProgress, course: QueryProps['course']) {
  const notes: QueryProps['notes'] = [];

  for (const sectionId in course_progress.progress) {
    const lessons = course_progress.progress[sectionId];
    for (const lessonId in lessons) {
      const lesson = lessons[lessonId];

      if (lesson?.notes && lesson.notes.length > 10) {
        const chapters = course.chapters;

        if (chapters) {
          for (const chapter of chapters) {
            console.log(chapter);
            for (const chapterLesson of chapter.lessons) {
              if (chapterLesson._id === lessonId) {
                const note = notes.find((note) => note.chapterName === chapter.chapterName);
                if (note) {
                  note.lessons.push({
                    name: chapterLesson.title,
                    notes: lesson.notes,
                  });
                } else {
                  notes.push({
                    chapterName: chapter.chapterName,
                    lessons: [
                      {
                        name: chapterLesson.title,
                        notes: lesson.notes,
                      },
                    ],
                  });
                }
              }
            }
          }
        }
      }
    }
  }

  console.log(notes);
  return notes;
}
