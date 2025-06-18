import { removeMarkdown } from '../../utils/remove-markdown';

export default {
  name: 'CtaSection',
  title: 'Sekcja CTA',
  type: 'object',
  fields: [
    {
      name: 'isReversed',
      type: 'boolean',
      title: 'Odwrócona sekcja? (zdjęcie po lewej)',
      initialValue: false,
    },
    {
      name: 'isHighlighted',
      type: 'boolean',
      title: 'Wyróżniona? (z subtelnym tłem)',
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
      title: 'CTA',
    },
    {
      name: 'cta_Annotation',
      type: 'markdown',
      title: 'CTA Annotation',
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
        title: `[Sekcja CTA] ${removeMarkdown(title)}`,
        subtitle: removeMarkdown(subtitle),
        media,
      };
    },
  },
};
