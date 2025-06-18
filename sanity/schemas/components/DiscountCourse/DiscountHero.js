import { removeMarkdown } from '../../../utils/remove-markdown';

export default {
  name: 'discountHero',
  type: 'object',
  title: '[Strona Podziękowania] Sekcja Hero',
  icon: () => '🎇',
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    {
      name: 'image',
      type: 'image',
      title: 'Obrazek w tle',
      validation: Rule => Rule.required(),
      description: 'Dla optymalnego doświadczenia zalecamy nie zmieniać bazowego obrazka',
      initialValue: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: 'image-832b337c71fccb644fa0e70197c9de1d9420e859-2996x2952-webp',
        },
      },
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
      title: 'Paragraf (opcjonalnie)',
      validation: Rule =>
        Rule.custom(text => {
          if (!text) return true; // Allow empty field
          const length = text.length;
          if (length > 750) {
            return 'Paragraf powinien zawierać od maximum 750 znaków. Aktualna długość: ' + length;
          }
          return true;
        }),
      description: 'Zalecana długość tekstu: 550-750 znaków',
    },
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'paragraph',
      media: 'image',
      icon: 'icon',
    },
    prepare: ({ title, subtitle, media, icon }) => ({
      title: removeMarkdown(title) || 'Sekcja Hero',
      subtitle: removeMarkdown(subtitle) || 'Brak podtytułu',
      media: media || icon,
    }),
  },
};
