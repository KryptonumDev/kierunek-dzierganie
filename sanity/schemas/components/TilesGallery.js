import { removeMarkdown } from '../../utils/remove-markdown';

export default {
  name: 'TilesGallery',
  title: 'Sekcja z kafelkami ze zdjęciami',
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
      of: [{ type: 'TilesGallery_Item' }],
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
        title: `[Sekcja z kafelkami ze zdjęciami] ${removeMarkdown(title)}`,
        subtitle: removeMarkdown(paragraph),
        media: list[0].img,
      };
    },
  },
};

export const TilesGallery_Item = {
  name: 'TilesGallery_Item',
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
      img: 'img',
    },
    prepare({ heading, paragraph, img }) {
      return {
        title: `${removeMarkdown(heading)}`,
        subtitle: `${removeMarkdown(paragraph)}`,
        media: img,
      };
    },
  },
};
