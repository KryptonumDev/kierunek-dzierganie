export default {
  name: 'Partner_Collection',
  title: 'Zbiór partnerów',
  type: 'document',
  icon: () => '👔',
  fields: [
    {
      name: 'img',
      type: 'image',
      title: 'Logo',
      validation: Rule => Rule.required(),
      description: 'Logo powinno być w formacie SVG.',
    },
    {
      name: 'name',
      type: 'string',
      title: 'Nazwa',
      validation: Rule => Rule.required(),
    },
    {
      name: 'description',
      type: 'text',
      rows: 5,
      title: 'Opis',
      validation: Rule => Rule.required(),
    },
    {
      name: 'href',
      type: 'url',
      title: 'Link do strony partnera',
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description',
      media: 'img',
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle,
        media,
      };
    },
  },
};
