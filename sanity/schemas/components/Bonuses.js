import { removeMarkdown } from '../../utils/remove-markdown';

export default {
  name: 'Bonuses',
  title: 'Bonusy',
  type: 'object',
  fields: [
    {
      name: 'heading',
      type: 'markdown',
      title: 'Nagłówek',
    },
    {
      name: 'list',
      type: 'array',
      of: [{ type: 'titleAndDescription' }],
      title: 'Lista',
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
        title: `[Bonusy] ${removeMarkdown(title)}`,
        subtitle: removeMarkdown(subtitle),
        media: img,
      };
    },
  },
};
