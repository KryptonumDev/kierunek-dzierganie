import { removeMarkdown } from '../../utils/remove-markdown';

export default {
  name: 'Reviews',
  title: 'Opinie kursantów',
  type: 'object',
  fields: [
    {
      name: 'heading',
      type: 'markdown',
      title: 'Nagłówek',
      validation: Rule => Rule.required(),
    },
    {
      name: 'list',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'ReviewCollection' }],
          options: {
            disableNew: true,
          },
        },
      ],
      title: 'Lista',
    },
  ],
  preview: {
    select: {
      title: 'heading',
      list: 'list',
    },
    prepare({ title, list }) {
      return {
        title: `[Opinie kursantów] ${removeMarkdown(title)}`,
        subtitle: `${list.length} opinii`,
      };
    },
  },
};
