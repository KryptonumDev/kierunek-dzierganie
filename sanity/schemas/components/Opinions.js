import { removeMarkdown } from '../../utils/remove-markdown';

export default {
  name: 'Opinions',
  title: 'Opinie',
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
      of: [{ type: 'Opinions_List' }],
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
        title: `[Opinie] ${removeMarkdown(title)}`,
        subtitle: `${list.length} items`,
      };
    },
  },
};

export const Opinions_List = {
  name: 'Opinions_List',
  title: 'Opinie Lista',
  type: 'object',
  fields: [
    {
      name: 'author',
      type: 'string',
      title: 'Autor',
      validation: Rule => Rule.required(),
    },
    {
      name: 'description',
      type: 'markdown',
      title: 'Opis',
      validation: Rule => Rule.required(),
    },
    {
      name: 'gallery',
      type: 'array',
      of: [{ type: 'image' }],
      validation: Rule => Rule.max(2),
      title: 'Galeria',
    },
  ],
  preview: {
    select: {
      author: 'author',
      description: 'description',
    },
    prepare({ author, description }) {
      return {
        title: `${author} wystawił/-a opinię`,
        subtitle: removeMarkdown(description),
      };
    },
  },
};
