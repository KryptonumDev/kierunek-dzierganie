import { removeMarkdown } from '../../../utils/remove-markdown';

const title = 'Zdjęcie z wyróżnieniem';
const icon = () => '🖼️';

export default {
  name: 'ImageBadge',
  type: 'object',
  title,
  icon,
  fields: [
    {
      name: 'badge',
      type: 'markdown',
      title: 'Wyróżnienie',
      validation: Rule => Rule.required(),
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
      badge: 'badge',
      media: 'img',
    },
    prepare({ badge, media }) {
      return {
        title: `[${title}] - ${removeMarkdown(badge)}`,
        media,
        icon,
      };
    },
  },
};
