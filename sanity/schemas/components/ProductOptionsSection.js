import { removeMarkdown } from '../../utils/remove-markdown';

const title = 'Sekcja kolumnowa (2-3 opcje)';
const icon = () => '🧶';

export default {
  name: 'ProductOptionsSection',
  type: 'object',
  title,
  icon,
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
      of: [{ type: 'ProductOptionsSection_Item' }],
      title: 'Kolumny',
      validation: Rule => Rule.min(2).max(3).required(),
      description: 'Dodaj 2 lub 3 kolumny.',
    },
  ],
  preview: {
    select: {
      heading: 'heading',
      list: 'list',
    },
    prepare: ({ heading, list }) => {
      return {
        title: `[${title}] ${removeMarkdown(heading)}`,
        subtitle: `${list?.length || 0} opcji`,
        media: list?.[0]?.img,
      };
    },
  },
};

export const ProductOptionsSection_Item = {
  name: 'ProductOptionsSection_Item',
  title: 'Kolumna',
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
      title: 'Opis',
      validation: Rule => Rule.required(),
    },
    {
      name: 'cta',
      type: 'cta',
      title: 'Przycisk',
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      heading: 'heading',
      paragraph: 'paragraph',
      media: 'img',
      cta: 'cta',
    },
    prepare: ({ heading, paragraph, media, cta }) => {
      return {
        title: `${removeMarkdown(heading)}`,
        subtitle: `${removeMarkdown(paragraph)} (${cta?.text || 'bez CTA'})`,
        media,
      };
    },
  },
};
