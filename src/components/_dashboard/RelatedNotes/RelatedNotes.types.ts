export type RelatedNotesTypes = {
  notes: {
    chapterName: string;
    lessons: {
      name: string;
      notes: string;
    }[];
  }[];
  courseName: string;
};
