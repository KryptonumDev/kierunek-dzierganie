import Contents from './Contents';
export type { Props as ContentsProps } from './Contents.types';
export default Contents;

export const Contents_Query = `
  content[] {
    title,
    description,
  },
`;