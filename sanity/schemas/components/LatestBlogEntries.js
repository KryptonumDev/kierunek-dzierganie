import { removeMarkdown } from '../../utils/remove-markdown';

const icon = () => '📰';
const title = 'Sekcja z najnowszymi wpisami bloga';

export default {
  name: 'LatestBlogEntries',
  type: 'object',
  title,
  icon,
  fields: [
    {
      name: 'heading',
      type: 'markdown',
      title: 'Nagłówek',
      validation: Rule => Rule.required(),
      initialValue: 'Blog pełen pasji i **inspiracji**',
    },
    {
      name: 'paragraph',
      type: 'markdown',
      title: 'Paragraf',
      validation: Rule => Rule.required(),
      initialValue: 'Zanurz się w artykuły pełne wartościowych porad i nowinek z zakresu dziergania i szydełkowania.',
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
        icon,
      };
    },
  },
};
