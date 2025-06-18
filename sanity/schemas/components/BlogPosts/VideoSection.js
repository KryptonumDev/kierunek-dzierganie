const title = 'Sekcja wideo';
const icon = () => '📹';

export default {
  name: 'VideoSection',
  type: 'object',
  title,
  icon,
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Tytuł filmu',
      description: 'Tytuł filmu, który zostanie wyświetlony na stronie',
      validation: Rule => Rule.required(),
    },
    {
      name: 'video',
      type: 'url',
      title: 'Wideo',
      description: 'Link do Vimeo',
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      heading: 'title',
    },
    prepare({ heading }) {
      return {
        title: `[${title}] - ${heading}`,
        icon,
      };
    },
  },
};
