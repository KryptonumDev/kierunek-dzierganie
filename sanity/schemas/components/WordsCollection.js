import { removeMarkdown } from '../../utils/remove-markdown';

const icon = () => '☁️';

export default {
  name: 'WordsCollection',
  title: 'Sekcja z kolekcją słów',
  type: 'object',
  icon,
  fields: [
    {
      name: 'image',
      type: 'image',
      title: 'Zdjęcie (opcjonalnie)',
      description: 'Zdjęcie pojawi się po środku sekcji, zmieniając jej wygląd.',
    },
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
          type: 'object',
          fields: [
            {
              name: 'name',
              type: 'string',
              title: 'Nazwa',
              validation: Rule => Rule.required(),
            },
            {
              name: 'href',
              type: 'string',
              title: 'Link relatywny (opcjonalny)',
              validation: Rule =>
                Rule.custom(value => {
                  if (value && !value.startsWith('/')) {
                    return 'Link musi być relatywny (zaczynający się od "/").';
                  }
                  return true;
                }),
            },
          ],
        },
      ],
      title: 'Lista',
      validation: Rule => Rule.required(),
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
      list: 'list',
      cta: 'cta',
      image: 'image',
    },
    prepare({ title, list, cta, image }) {
      return {
        title: `[Sekcja z kolekcją słów${cta ? ' - wraz z CTA' : ''}] ${removeMarkdown(title)}`,
        subtitle: list.join(', '),
        media: image || icon,
      };
    },
  },
};
