import { removeMarkdown } from '../../utils/remove-markdown';

export default {
  name: "ImageAndText",
  title: "Obrazek i Opis",
  type: "object",
  fields: [
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
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'img',
    }
  },
  prepare({ title, subtitle, media }) {
    return {
      title: removeMarkdown(title),
      subtitle: removeMarkdown(subtitle),
      media,
    }
  }
}