import { removeMarkdown } from '../../utils/remove-markdown';

export default {
  name: 'CustomerCaseStudy',
  title: 'Historie kursantów',
  type: 'object',
  icon: () => '🙋‍♀️',
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
      validation: Rule => Rule.required(),
    },
    {
      name: 'list',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            {
              type: 'CustomerCaseStudy_Collection',
            },
          ],
          options: {
            disableNew: true,
          },
        },
      ],
      title: 'Lista',
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'paragraph',
      media: 'list',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: `[Historie kursantów] ${removeMarkdown(title)}`,
        subtitle: removeMarkdown(subtitle),
        media: media[0].img,
      };
    },
  },
};
