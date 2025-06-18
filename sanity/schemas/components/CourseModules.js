import { removeMarkdown } from '../../utils/remove-markdown';

export default {
  name: 'CourseModules',
  title: 'Moduły kursu',
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
      validation: Rule => Rule.required(),
    },
    {
      name: 'list',
      type: 'array',
      of: [{ type: 'titleAndDescription' }],
      title: 'Lista',
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'paragraph',
      img: 'list[0].img',
    },
    prepare({ title, subtitle, img }) {
      return {
        title: `[Moduły kursu] ${removeMarkdown(title)}`,
        subtitle: removeMarkdown(subtitle),
        media: img,
      };
    },
  },
};
