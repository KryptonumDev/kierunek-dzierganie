import { removeMarkdown } from '../../utils/remove-markdown';

export default {
  name: 'TilesFeatures',
  title: 'Wyróżniki kafelki',
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
    },
    {
      name: 'list',
      type: 'array',
      of: [{ type: 'TilesFeatures_Item' }],
      title: 'Lista',
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      heading: 'heading',
      list: 'list',
    },
    prepare({ heading, list }) {
      return {
        title: `[Wyróżniki kafelki] ${removeMarkdown(heading)}`,
        subtitle: `${list.length} wyróżników`,
        media: list[0].img,
      };
    },
  },
};

export const TilesFeatures_Item = {
  name: 'TilesFeatures_Item',
  title: 'Element',
  type: 'object',
  fields: [
    {
      name: 'img',
      type: 'image',
      title: 'Zdjęcie',
      validation: Rule => Rule.required(),
    },
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
      media: 'img',
    },
    prepare({ heading, paragraph, media }) {
      return {
        title: `${removeMarkdown(heading)}`,
        subtitle: `${removeMarkdown(paragraph)}`,
        media,
      };
    },
  },
};
