import type { CoursesProgress } from '@/global/types';

export default function getCourseCompletionPercentage(course_progress: CoursesProgress) {
  let totalLessons = 0;
  let completedLessons = 0;

  for (const sectionId in course_progress.progress) {
    const lessons = course_progress.progress[sectionId];
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
}
