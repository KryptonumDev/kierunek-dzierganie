import { removeMarkdown } from '../../utils/remove-markdown';

export default {
  name: 'Faq',
  title: 'FAQ',
  type: 'object',
  icon: () => '❓',
  fields: [
    {
      name: 'heading',
      type: 'markdown',
      title: 'Nagłówek',
      validation: Rule => Rule.required(),
      initialValue: 'Masz pytanie na temat współpracy? Tutaj znajdziesz **odpowiedź**!',
    },
    {
      name: 'paragraph',
      type: 'markdown',
      title: 'Paragraf (opcjonalnie)',
      initialValue: 'Wszystko, co musisz wiedzieć, by wyruszyć w kreatywną podróż z rękodziełem!',
    },
    {
      name: 'list',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            {
              type: 'FaqCollection',
            },
          ],
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
        title: `[FAQ] ${removeMarkdown(title)}`,
        subtitle: `${list?.length || 0} przypiętych elementów FAQ`,
      };
    },
  },
};
