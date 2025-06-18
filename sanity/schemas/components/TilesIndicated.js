import { removeMarkdown } from '../../utils/remove-markdown';

const icon = () => '🔗';

export default {
  name: 'TilesIndicated',
  title: 'Dwa kafelki ze wsazującymi strzałkami',
  type: 'object',
  icon,
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
          type: 'TilesIndicated_Item',
        },
      ],
      title: 'Lista',
      validation: Rule => Rule.required().min(2).max(2),
    },
  ],
  preview: {
    select: {
      title: 'heading',
      list: 'list',
    },
    prepare({ title, list }) {
      return {
        title: `[Dwa kafelki ze wsazującymi strzałkami] ${removeMarkdown(title)}`,
        subtitle: `${list.length} elementy`,
        media: icon,
      };
    },
  },
};

export const TilesIndicated_Item = {
  name: 'TilesIndicated_Item',
  title: 'Element',
  type: 'object',
  fields: [
    {
      name: 'image',
      type: 'image',
      title: 'Zdjęcie (opcjonalnie)',
    },
    {
      name: 'title',
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
      name: 'cta',
      type: 'cta',
      title: 'Wezwanie do działania',
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      paragraph: 'paragraph',
      image: 'image',
    },
    prepare({ title, paragraph, image }) {
      return {
        title,
        paragraph: removeMarkdown(paragraph),
        media: image,
      };
    },
  },
};
