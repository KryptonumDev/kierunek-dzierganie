import { removeMarkdown } from '../../../utils/remove-markdown';

const title = 'Wyróżnione zdjęcie';
const icon = () => '🖼️';

export default {
  name: 'HighlightedImage',
  type: 'object',
  title,
  icon,
  fields: [
    {
      name: 'img',
      type: 'image',
      title: 'Zdjęcie',
      validation: Rule => Rule.required(),
    },
    {
      name: 'paragraph',
      type: 'markdown',
      title: 'Paragraf',
      validation: Rule => Rule.required(),
    },
    {
      name: 'isBackground',
      type: 'boolean',
      title: 'Czy zdjęcie ma mieć tło?',
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      media: 'img',
      paragraph: 'paragraph',
    },
    prepare({ paragraph, media }) {
      return {
        title: `[${title}] - ${removeMarkdown(paragraph)}`,
        media,
        icon,
      };
    },
  },
};
