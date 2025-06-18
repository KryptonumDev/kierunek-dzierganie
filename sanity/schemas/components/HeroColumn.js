import { removeMarkdown } from '../../utils/remove-markdown';

export default {
  name: 'HeroColumn',
  title: 'Sekcja Hero z kolumną (zdjęcie, nagłówek oraz paragraf)',
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
      name: 'img',
      type: 'image',
      title: 'Zdjęcie',
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'paragraph',
      media: 'img',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: `[Sekcja Hero z kolumną (zdjęcie, nagłówek oraz paragraf)] ${removeMarkdown(title)}`,
        subtitle: removeMarkdown(subtitle),
        media,
      };
    },
  },
};
