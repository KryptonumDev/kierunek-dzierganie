import { validation } from 'sanity';
import { removeMarkdown } from '../../utils/remove-markdown';

export default {
  name: 'TilesGrid',
  title: 'Sekcja z kolumną kafelków z CTA',
  type: 'object',
  icon: () => '| CTA |',
  fields: [
    {
      name: 'logo',
      type: 'image',
      title: 'Logo (opcjonalne)',
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
    {
      name: 'list',
      type: 'array',
      of: [{ type: 'TilesGrid_Item' }],
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
        title: `[Sekcja z kolumną kafelków z CTA] ${removeMarkdown(title)}`,
        subtitle: removeMarkdown(paragraph),
        media: list[0].img,
      };
    },
  },
};

export const TilesGrid_Item = {
  name: 'TilesGrid_Item',
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
      name: 'cta',
      type: 'cta',
      title: 'Wezwanie do działania',
    },
  ],
  preview: {
    select: {
      img: 'img',
      cta: 'cta',
    },
    prepare({ img, cta }) {
      return {
        title: `'${cta.text}' kierujący do '${cta.href}'`,
        media: img,
      };
    },
  },
};
