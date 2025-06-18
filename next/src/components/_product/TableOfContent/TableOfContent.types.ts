export type TableOfContentTypes = {
  chapters: {
    chapterName: string;
    lessons: {
      title: string;
      lengthInMinutes: number;
    }[];
  }[];
};
