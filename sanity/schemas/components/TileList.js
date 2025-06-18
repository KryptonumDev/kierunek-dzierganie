import { removeMarkdown } from '../../utils/remove-markdown';

export default {
  name: 'TileList',
  title: 'Lista Kafelek',
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
    {
      name: 'paragraph',
      type: 'markdown',
      title: 'Paragraf',
    },
    {
      name: 'cta',
      type: 'cta',
      title: 'CTA',
    },
    {
      name: 'cta_Annotation',
      type: 'markdown',
      title: 'CTA Annotation',
    },
  ],
  preview: {
    select: {
      title: 'heading',
      list: 'list',
    },
    prepare({ title, list }) {
      return {
        title: `[Lista Kafelek] ${removeMarkdown(title)}`,
        subtitle: `${list.length} items`,
      };
    },
  },
};
