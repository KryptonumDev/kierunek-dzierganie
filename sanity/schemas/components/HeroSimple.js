import { removeMarkdown } from '../../utils/remove-markdown';

const title = 'Prosta HERO sekcja';
export const HeroSimple_Title = title;
const icon = () => 'SH';

export default {
  name: 'HeroSimple',
  type: 'object',
  title,
  icon,
  fields: [
    {
      name: 'isHighlighted',
      type: 'boolean',
      title: 'Czy jest wyróżniony tłem?',
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
      title: 'Paragraf (opcjonalnie)',
    },
    {
      name: 'cta',
      type: 'cta',
      title: 'Wezwanie do działania (opcjonalnie)',
    },
  ],
  preview: {
    select: {
      heading: 'heading',
      paragraph: 'paragraph',
    },
    prepare({ heading, paragraph }) {
      return {
        title: `[${title}] ${removeMarkdown(heading)}`,
        subtitle: removeMarkdown(paragraph),
        icon,
      };
    },
  },
};
