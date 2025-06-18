import { removeMarkdown } from '../../utils/remove-markdown';

export default {
  name: 'SimpleCtaSection',
  title: 'Prosta Sekcja CTA',
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
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'paragraph',
    },
    prepare({ title, subtitle }) {
      return {
        title: `[Prosta Sekcja CTA] ${removeMarkdown(title)}`,
        subtitle: removeMarkdown(subtitle),
      };
    },
  },
};
