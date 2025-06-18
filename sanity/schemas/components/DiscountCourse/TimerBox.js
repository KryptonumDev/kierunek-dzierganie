import { removeMarkdown } from '../../../utils/remove-markdown';

export default {
  name: 'timerBox',
  type: 'object',
  icon: () => '🕒',
  title: '[Strona Podziękowania] Sekcja z kursem i licznikiem',
  fields: [
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
    },
    prepare: ({ title, subtitle, icon }) => ({
      title: removeMarkdown(title) || 'Sekcja z kursem i licznikiem',
      subtitle: removeMarkdown(subtitle) || 'Brak podtytułu',
      icon,
    }),
  },
};
