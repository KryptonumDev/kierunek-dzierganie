import { removeMarkdown } from '../../utils/remove-markdown';

export default {
  name: 'titleAndDescription',
  title: 'Tytuł i Opis',
  type: 'object',
  fields: [
    {
      name: 'isImg',
      type: 'boolean',
      title: 'Czy jest zdjęcie?',
      initialValue: false,
    },
    {
      name: 'title',
      type: 'markdown',
      title: 'Tytuł',
    },
    {
      name: 'description',
      type: 'markdown',
      title: 'Opis',
    },
    {
      name: 'img',
      type: 'image',
      title: 'Zdjęcie',
      hidden: ({ parent }) => !parent?.isImg,
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'img',
    },
  },
  prepare({ title, subtitle, media }) {
    return {
      title: removeMarkdown(title),
      subtitle: removeMarkdown(subtitle),
      media,
    };
  },
};
