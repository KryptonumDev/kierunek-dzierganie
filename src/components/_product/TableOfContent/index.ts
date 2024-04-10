import TableOfContent from './TableOfContent';
export default TableOfContent;

export const TableOfContent_Query = `
  course -> {
    chapters[] {
      chapterName,
      lessons[] -> {
        title,
        lengthInMinutes,
      },
    },
  },
`;
