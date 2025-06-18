import { removeMarkdown } from '../../../utils/remove-markdown';

const title = 'Pokazanie procesu';
const icon = () => '🔢';

export default {
  name: 'ProcessShowcase',
  type: 'object',
  title,
  icon,
  fields: [
    {
      name: 'list',
      type: 'array',
      of: [{ type: 'ProcessShowcase_List' }],
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
        title: `[${title}] - ${removeMarkdown(list[0].heading)}`,
        media: list[0].process[0].img,
        icon,
      };
    },
  },
};

export const ProcessShowcase_Process = {
  name: 'ProcessShowcase_Process',
  type: 'object',
  title: 'Proces',
  fields: [
    {
      name: 'img',
      type: 'image',
      title: 'Zdjęcie',
    },
    {
      name: 'paragraph',
      type: 'markdown',
      title: 'Paragraf',
    },
    {
      name: 'isReversed',
      type: 'boolean',
      title: 'Czy zdjęcie ma być po prawej stronie?',
      initialValue: false,
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      paragraph: 'paragraph',
      media: 'img',
    },
    prepare({ media, paragraph }) {
      return {
        title: `${removeMarkdown(paragraph)}`,
        media,
      };
    },
  },
};

export const ProcessShowcase_List = {
  name: 'ProcessShowcase_List',
  type: 'object',
  title: 'Lista',
  fields: [
    {
      name: 'heading',
      type: 'markdown',
      title: 'Nagłówek',
      validation: Rule => Rule.required(),
    },
    {
      name: 'process',
      type: 'array',
      of: [{ type: 'ProcessShowcase_Process' }],
      title: 'Proces',
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      heading: 'heading',
      media: 'process.0.img',
    },
    prepare({ media, heading }) {
      return {
        title: `${removeMarkdown(heading)}`,
        media,
      };
    },
  },
};
