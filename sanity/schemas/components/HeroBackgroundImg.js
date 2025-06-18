import { removeMarkdown } from '../../utils/remove-markdown';

export default {
  name: 'HeroBackgroundImg',
  title: 'Hero ze Zdjęciem w Tle',
  type: 'object',
  fields: [
    {
      name: 'isReversed',
      type: 'boolean',
      title: 'Odwróć kolejność',
      description: 'Domyślnie tekst znajduję się po prawej stronie. Jeśli zaznaczone tekst będzie po lewej stronie.',
      initialValue: false,
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
      name: 'cta',
      type: 'cta',
      title: 'Wezwanie do działania (opcjonalnie)',
    },
    {
      name: 'cta_Annotation',
      type: 'markdown',
      title: 'CTA - adnotacja (opcjonalnie)',
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
        title: `[Hero ze Zdjęciem w Tle] ${removeMarkdown(title)}`,
        subtitle: removeMarkdown(subtitle),
        media,
      };
    },
  },
};
