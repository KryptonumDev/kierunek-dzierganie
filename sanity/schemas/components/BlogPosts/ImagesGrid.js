import { removeMarkdown } from '../../../utils/remove-markdown';

const title = 'Siatka zdjęć';
const icon = () => '🖼️';

export default {
  name: 'ImagesGrid',
  type: 'object',
  title,
  icon,
  fields: [
    {
      name: 'list',
      type: 'array',
      of: [{ type: 'ImagesGrid_List' }],
      title: 'Lista',
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      list: 'list',
    },
    prepare({ list }) {
      return {
        title: `[${title}] - liczba zdjęć: ${list.length}`,
        media: list[0].img,
        icon,
      };
    },
  },
};

export const ImagesGrid_List = {
  name: 'ImagesGrid_List',
  type: 'object',
  title: 'Lista zdjęć',
  fields: [
    {
      name: 'img',
      type: 'image',
      title: 'Zdjęcie',
      validation: Rule => Rule.required(),
    },
    {
      name: 'paragraph',
      type: 'markdown',
      title: 'Paragraf',
    },
  ],
  preview: {
    select: {
      paragraph: 'paragraph',
      media: 'img',
    },
    prepare({ media, paragraph }) {
      return {
        title: `${paragraph ? removeMarkdown(paragraph) : 'Zdjęcie'}`,
        media,
      };
    },
  },
};
