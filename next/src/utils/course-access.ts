import type { CoursesProgress } from '@/global/types';

type CourseAccessLike = Pick<CoursesProgress, 'course_id' | 'access_expires_at'>;

export function isCourseAccessActive(courseAccess: CourseAccessLike, referenceDate = new Date()) {
  if (!courseAccess.access_expires_at) return true;

  return new Date(courseAccess.access_expires_at).getTime() > referenceDate.getTime();
}

export function getActiveCourseProgressList<T extends CourseAccessLike>(
  courseProgressList?: T[] | null,
  referenceDate = new Date()
) {
  if (!courseProgressList) return [];

  return courseProgressList.filter((courseProgress) => isCourseAccessActive(courseProgress, referenceDate));
}

export function findActiveCourseProgress<T extends CourseAccessLike>(
  courseProgressList: T[] | null | undefined,
  courseId: string,
  referenceDate = new Date()
) {
  return getActiveCourseProgressList(courseProgressList, referenceDate).find(
    (courseProgress) => courseProgress.course_id === courseId
  );
}

export function getActiveOwnedCourseIds<T extends CourseAccessLike>(
  courseProgressList?: T[] | null,
  referenceDate = new Date()
) {
  return Array.from(new Set(getActiveCourseProgressList(courseProgressList, referenceDate).map((course) => course.course_id)));
}
