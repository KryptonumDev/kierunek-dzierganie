import { removeMarkdown } from '../../utils/remove-markdown';

const title = 'Przedstawienie firm';
const icon = () => '🏢';

export default {
  name: 'CompaniesShowcase',
  type: 'object',
  title,
  icon,
  fields: [
    {
      name: 'heading',
      type: 'markdown',
      title: 'Nagłówek',
      validation: Rule => Rule.required(),
      initialValue: 'Nasze **marki**',
    },
    {
      name: 'paragraph',
      type: 'markdown',
      title: 'Paragraf',
      validation: Rule => Rule.required(),
      initialValue: 'Zobacz za sukcesem, **jakich marek stoimy**',
    },
    {
      name: 'cta',
      type: 'cta',
      validation: Rule => Rule.required(),
    },
    {
      name: 'list',
      type: 'array',
      of: [{ type: 'CompaniesShowcase_Item' }],
      title: 'Lista firm',
    },
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'paragraph',
    },
    prepare({ title, subtitle }) {
      return {
        title: `[Przedstawienie firm] ${removeMarkdown(title)}`,
        subtitle: removeMarkdown(subtitle),
        icon,
      };
    },
  },
};

export const CompaniesShowcase_Item = {
  name: 'CompaniesShowcase_Item',
  title: 'Firma',
  type: 'object',
  fields: [
    {
      name: 'img',
      type: 'image',
      title: 'Logo',
      validation: Rule => Rule.required(),
    },
    {
      name: 'href',
      type: 'url',
      title: 'Link do strony (opcjonalne)',
    },
    {
      name: 'title',
      type: 'markdown',
      title: 'tytuł',
      validation: Rule => Rule.required(),
    },
    {
      name: 'description',
      type: 'markdown',
      title: 'Opis',
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'img',
    },
  },
};
