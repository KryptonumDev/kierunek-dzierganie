type UnlockableChapter = {
  dateOfUnlock?: string | Date | null;
};

export const isProgramChapterUnlocked = (
  courseType: 'course' | 'program',
  chapter: UnlockableChapter,
  now = new Date()
) => {
  if (courseType !== 'program') return true;
  if (!chapter.dateOfUnlock) return true;

  return new Date(chapter.dateOfUnlock) <= now;
};
