import { removeMarkdown } from '../../utils/remove-markdown';

export default {
  name: 'TabSection',
  title: 'Sekcja z zakładkami do wyboru',
  type: 'object',
  fields: [
    {
      name: 'heading',
      type: 'markdown',
      title: 'Nagłówek',
      validation: Rule => Rule.required(),
    },
    {
      name: 'paragraph',
      type: 'markdown',
      title: 'Paragraf',
    },
    {
      name: 'list',
      type: 'array',
      of: [
        {
          type: 'TabSection_Item',
        },
      ],
      title: 'Lista',
      validation: Rule => Rule.required().min(2).max(5),
    },
    {
      name: 'cta',
      type: 'cta',
      title: 'Wezwanie do działania (opcjonalnie)',
    },
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'paragraph',
      cta: 'cta',
    },
    prepare({ title, subtitle, cta }) {
      return {
        title: `[Sekcja z zakładkami do wyboru] ${removeMarkdown(title)}`,
        subtitle: `${removeMarkdown(subtitle)}${cta && ` | '${cta.text}' kierujący do '${cta.href}'`}`,
      };
    },
  },
};

export const TabSection_Item = {
  name: 'TabSection_Item',
  title: 'Element',
  type: 'object',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Tytuł',
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
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: `${removeMarkdown(subtitle)}`,
      };
    },
  },
};
