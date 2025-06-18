import { removeMarkdown } from '../../../utils/remove-markdown';

export default {
  name: 'imageHeading',
  type: 'object',
  icon: () => '🖼️',
  title: '[Strona Podziękowania] Sekcja z obrazkiem i nagłówkiem',
  fields: [
    {
      name: 'image',
      type: 'image',
      title: 'Obrazek',
      validation: Rule => Rule.required(),
    },
    {
      name: 'heading',
      type: 'string',
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
      title: 'heading',
      subtitle: 'paragraph',
      icon: 'icon',
      media: 'image',
    },
    prepare: ({ title, subtitle, icon, media }) => ({
      title: removeMarkdown(title) || 'Sekcja z obrazkiem i nagłówkiem',
      subtitle: removeMarkdown(subtitle) || 'Brak podtytułu',
      media,
      icon,
    }),
  },
};
