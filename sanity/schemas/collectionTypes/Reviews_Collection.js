export default {
  name: 'productReviewCollection',
  title: 'Zbiór opinii',
  type: 'document',
  icon: () => '📝',
  fields: [
    {
      name: 'visible',
      type: 'boolean',
      title: 'Widoczny na podstronie produktu',
      initialValue: true,
      validation: Rule => Rule.required(),
    },
    {
      name: 'nameOfReviewer',
      type: 'string',
      title: 'Imię kursantki',
      validation: Rule => Rule.required(),
    },
    {
      name: 'linkToHistory',
      type: 'string',
      title: 'Link do historii kursantki',
    },
    {
      name: 'review',
      type: 'markdown',
      title: 'Opinia',
      validation: Rule => Rule.required(),
    },
    {
      name: 'rating',
      type: 'number',
      title: 'Ocena',
      validation: Rule => Rule.required().min(1).max(5),
    },
    {
      name: 'course',
      title: 'Produkt',
      type: 'reference',
      to: [
        {
          type: 'course',
        },
        {
          type: 'bundle',
        },
        {
          type: 'product',
        },
      ],
      validation: Rule => Rule.required(),
    },
    {
      name: 'images',
      type: 'array',
      title: 'Zdjęcia',
      of: [
        {
          type: 'image',
        },
      ],
    },
  ],
  preview: {
    select: {
      name: 'nameOfReviewer',
      course: 'course.name',
      mark: 'rating',
    },
    prepare({ name, course, mark }) {
      return {
        title: `${course} - ${name} ${mark}/5`,
      };
    },
  },
};
