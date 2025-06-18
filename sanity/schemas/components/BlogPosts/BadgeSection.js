const title = 'Odznaczenie';
const icon = () => '🌟';

export default {
  name: 'BadgeSection',
  type: 'object',
  title,
  icon,
  fields: [
    {
      name: 'badge',
      type: 'string',
      title: 'Odznaczenie',
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      badge: 'badge',
    },
    prepare({ badge }) {
      return {
        title: `[${title}] - ${badge}`,
        media: icon,
      };
    },
  },
};
