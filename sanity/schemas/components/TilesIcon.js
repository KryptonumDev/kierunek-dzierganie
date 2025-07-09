import { removeMarkdown } from '../../utils/remove-markdown';

export default {
  name: 'TilesIcon',
  title: 'Sekcja z kolumną kafelków z ikoną',
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
      name: 'list',
      type: 'array',
      of: [{ type: 'TilesIcon_Item' }],
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
    prepare({ title, paragraph, list, image }) {
      return {
        title: `[Sekcja z kolumną kafelków z ikoną] ${removeMarkdown(title)}`,
        subtitle: removeMarkdown(paragraph),
        media: list[0].image || list[0].icon,
      };
    },
  },
};

export const TilesIcon_Item = {
  name: 'TilesIcon_Item',
  title: 'Element',
  type: 'object',
  fields: [
    {
      name: 'icon',
      type: 'image',
      title: 'Ikona (opcjonalnie)',
      description: 'Ikona w formacie SVG. Jeśli nie zostanie dodana, kafelek będzie wyświetlany bez ikony.',
    },
    {
      name: 'title',
      type: 'markdown',
      title: 'Tytuł',
      validation: Rule => Rule.required(),
    },
    {
      name: 'description',
      type: 'markdown',
      title: 'Opis',
      validation: Rule => Rule.required(),
    },
    {
      name: 'image',
      type: 'image',
      title: 'Zdjęcie (opcjonalnie)',
    },
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
      icon: 'icon',
    },
    prepare({ icon, title, description }) {
      return {
        title: removeMarkdown(title),
        subtitle: removeMarkdown(description),
        media: icon,
      };
    },
  },
};
