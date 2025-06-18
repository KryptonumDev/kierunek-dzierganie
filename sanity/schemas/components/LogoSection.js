import { removeMarkdown } from '../../utils/remove-markdown';

const title = 'Sekcja z logiem';
export const LogoSection_Title = title;
const icon = () => '🖼️';

export default {
  name: 'LogoSection',
  type: 'object',
  title,
  icon,
  fields: [
    {
      name: 'logo',
      type: 'image',
      title: 'Logo',
      validation: Rule => Rule.required(),
    },
    {
      name: 'heading',
      type: 'markdown',
      title: 'Nagłówek (opcjonalnie)',
    },
    {
      name: 'paragraph',
      type: 'markdown',
      title: 'Paragraf',
      validation: Rule => Rule.required().max(100),
    },
    {
      name: 'optional_Paragraph',
      type: 'markdown',
      title: 'Drugi paragraf (opcjonalnie)',
      validation: Rule => Rule.max(100),
    },
  ],
  preview: {
    select: {
      heading: 'heading',
      subtitle: 'paragraph',
    },
    prepare({ heading, subtitle }) {
      return {
        title: `[${title}] ${removeMarkdown(heading)}`,
        subtitle: removeMarkdown(subtitle),
      };
    },
  },
};
