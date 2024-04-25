'use server';
import type { Course, CoursesProgress } from '@/global/types';
import { createClient } from './supabase-server';

export async function checkCourseProgress(course: Course, progress: CoursesProgress) {
  const supabase = createClient();
  // check if there is new lessons/chapters or some lessons/chapters were removed and update progress
  const newProgress = {
    ...progress,
    progress: course.chapters.reduce(
      (acc, el) => {
        acc[el._id] = el.lessons.reduce(
          (inAcc, inEl) => {
            if (!progress.progress?.[el._id]?.[inEl._id])
              inAcc[inEl._id] = {
                ended: false,
                notes: null,
              };
            else inAcc[inEl._id] = progress.progress[el._id]![inEl._id]!;

            return inAcc;
          },
          {} as CoursesProgress['progress'][string]
        );
        return acc;
      },
      {} as CoursesProgress['progress']
    ),
  };

  // check if newProgress different from progress change it in supabase
  let different = false;
  for (const key in newProgress.progress) {
    if(!progress.progress?.[key]){
      different = true;
      break;
    }

    if (Object.keys(newProgress.progress[key]!).length !== Object.keys(progress.progress[key]!).length) {
      different = true;
      break;
    }
    for (const inKey in newProgress.progress[key]) {
      if (!progress.progress[key]?.[inKey]) {
        different = true;
        break;
      }
    }
  }
  if (different) {
    await supabase.from('courses_progress').update({ progress: newProgress.progress }).eq('id', newProgress.id);
  }

  await supabase.from('profiles').update({ last_watched_course: course._id }).eq('id', progress.owner_id);

  return newProgress;
}

// const newObj = {
//   ...progress,
//   progress: course.chapters.reduce(
//     (acc, el) => {
//       acc[el._id] = el.lessons.reduce(
//         (acc, el) => {
//           acc[el._id] = {
//             ended: false,
//             notes: null,
//           };
//           return acc;
//         },
//         {} as Record<string, { ended: boolean; notes: null }>
//       );
//       return acc;
//     },
//     {} as Record<string, Record<string, { ended: boolean; notes: null }>>
//   ),
// };
