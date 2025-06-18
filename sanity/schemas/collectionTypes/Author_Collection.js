import { removeMarkdown } from '../../utils/remove-markdown';

const title = 'Zbiór autorów';
const icon = () => '👤';

export default {
  name: 'Author_Collection',
  type: 'document',
  title,
  icon,
  fields: [
    {
      name: 'name',
      type: 'markdown',
      title: 'Imię autora',
      validation: Rule => Rule.required(),
    },
    {
      name: 'paragraph',
      type: 'markdown',
      title: 'Paragraf widoczny przy prezentacji autora',
      validation: Rule => Rule.required(),
    },
    {
      name: 'img',
      type: 'image',
      title: 'Zdjęcie autora',
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'paragraph',
      media: 'img',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: removeMarkdown(title),
        subtitle: removeMarkdown(subtitle),
        media,
      };
    },
  },
};
