import { removeMarkdown } from '../../utils/remove-markdown';

export default {
  name: 'ImageShowcase',
  title: 'Pokaz Zdjęć',
  type: 'object',
  fields: [
    {
      name: 'isGrid',
      type: 'boolean',
      initialValue: true,
      title: 'Czy galeria jest w formie siatki?',
      description: 'Jeśli zaznaczone, zdjęcia będą wyświetlane w formie siatki. W przeciwnym wypadku będą wyświetlane jako "latające" zdjęcia i wtedy ich maksymalna ilość to 4.',
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
    {
      name: 'cta',
      type: 'cta',
      title: 'Wezwanie do działania (opcjonalne)',
    },
    {
      name: 'cta_Annotation',
      type: 'markdown',
      title: 'Podpis pod przyciskiem (opcjonalne)',
    },
    {
      name: 'img',
      type: 'array',
      of: [
        { type: 'image' }
      ],
      title: 'Zdjęcia',
      validation: Rule =>
        Rule.custom((array, context) => {
          if (!context.parent.isGrid && array.length > 4) return 'Galeria nie może mieć więcej niż 4 zdjęcia';
          return true;
        }),
    },
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'paragraph',
      media: 'img[0]',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: `[Pokaz zdjęć] ${removeMarkdown(title)}`,
        subtitle: removeMarkdown(subtitle),
        media,
      };
    },
  },
};
