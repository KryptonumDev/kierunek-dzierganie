const title = 'Cytat';
const icon = () => '💬';

export default {
  name: 'QuoteSection',
  type: 'object',
  title,
  icon,
  fields: [
    {
      name: 'quote',
      type: 'text',
      title: 'Cytat',
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      quote: 'quote',
    },
    prepare({ quote }) {
      return {
        title: `[${title}] - ${quote}`,
        media: icon,
      };
    },
  },
};
