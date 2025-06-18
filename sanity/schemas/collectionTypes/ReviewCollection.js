export default {
  name: 'ReviewCollection',
  title: 'Zbiór opinii kursantów',
  type: 'document',
  icon: () => '📝',
  fields: [
    {
      name: 'rating',
      type: 'number',
      title: 'Ocena (1-5)',
      validation: Rule => Rule.required().min(1).max(5),
    },
    {
      name: 'name',
      type: 'string',
      title: 'Imię',
      validation: Rule => Rule.required(),
    },
    {
      name: 'review',
      type: 'text',
      rows: 5,
      title: 'Opinia',
      validation: Rule => Rule.required(),
    },
    {
      name: 'images',
      type: 'array',
      of: [
        {
          type: 'image',
          title: 'Zdjęcie',
          validation: Rule => Rule.required(),
        },
      ],
      title: 'Zdjęcia (opcjonalnie)',
      validation: Rule => Rule.max(2),
    },
  ],
  preview: {
    select: {
      rating: 'rating',
      name: 'name',
      subtitle: 'review',
      media: 'images',
    },
    prepare({ rating, name, subtitle, media }) {
      return {
        title: `${name} ocenił/-a kurs na ${rating} / 5`,
        subtitle: subtitle,
        media: media && media[0],
      };
    },
  },
};
