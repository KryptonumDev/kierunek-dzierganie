import { removeMarkdown } from '../../utils/remove-markdown';

export default {
  name: 'TilesSticky',
  title: 'Sekcja z kafelkami z przyczepionym nagłówkiem',
  type: 'object',
  fields: [
    {
      name: 'heading',
      type: 'markdown',
      title: 'Nagłówek',
      validation: Rule => Rule.required(),
    },
    {
      name: 'paragraph',
      type: 'markdown',
      title: 'Paragraf',
      validation: Rule => Rule.required(),
    },
    {
      name: 'cta',
      type: 'cta',
      title: 'Wezwanie do działania',
    },
    {
      name: 'list',
      type: 'array',
      of: [{ type: 'TilesSticky_Item' }],
      title: 'Lista',
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'heading',
      paragraph: 'paragraph',
      list: 'list',
    },
    prepare({ title, paragraph, list }) {
      return {
        title: `[Sekcja z kafelkami z przyczepionym nagłówkiem] ${removeMarkdown(title)}`,
        subtitle: removeMarkdown(paragraph),
        media: list[0].img,
      };
    },
  },
};

export const TilesSticky_Item = {
  name: 'TilesSticky_Item',
  title: 'Element',
  type: 'object',
  fields: [
    {
      name: 'heading',
      type: 'markdown',
      title: 'Nagłówek',
      validation: Rule => Rule.required(),
    },
    {
      name: 'paragraph',
      type: 'markdown',
      title: 'Paragraf',
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      heading: 'heading',
      paragraph: 'paragraph',
    },
    prepare({ heading, paragraph }) {
      return {
        title: `${removeMarkdown(heading)}`,
        subtitle: `${removeMarkdown(paragraph)}`,
      };
    },
  },
};
