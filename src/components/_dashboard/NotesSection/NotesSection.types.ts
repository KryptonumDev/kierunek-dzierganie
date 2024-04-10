export type NotesSectionTypes = {
  notes: {
    chapterName: string;
    lessons: {
      name: string;
      notes: string;
    }[];
  }[];
  courseName: string;
  notesSum?: number;
};
