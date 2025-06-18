import { removeMarkdown } from '../../utils/remove-markdown';

export default {
  name: 'Partners',
  title: 'Sekcja partnerzy',
  type: 'object',
  icon: () => '👔',
  fields: [
    {
      name: 'heading',
      type: 'markdown',
      title: 'Nagłówek',
      validation: Rule => Rule.required(),
      initialValue: 'Z kim **współpracuję**?',
    },
    {
      name: 'paragraph',
      type: 'markdown',
      title: 'Paragraf',
      validation: Rule => Rule.required(),
      initialValue: 'Poznaj marki, które wspierają mnie w **szerzeniu miłości** do rękodzieła',
    },
    {
      name: 'cta',
      type: 'cta',
      title: 'Wezwanie do działania (opcjonalnie)',
    },
    {
      name: 'list',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: { type: 'Partner_Collection' },
        },
      ],
      title: 'Lista',
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'heading',
      list: 'list',
    },
    prepare({ title, list }) {
      return {
        title: `[Sekcja partnerzy] ${removeMarkdown(title)}`,
        subtitle: `${list?.length} pokazanych partnerów`,
        media: () => '👔',
      };
    },
  },
};
