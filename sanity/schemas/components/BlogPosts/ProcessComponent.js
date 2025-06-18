const title = 'Proces';
const icon = () => '🔧';

export default {
  name: 'ProcessComponent',
  type: 'object',
  title,
  icon,
  fields: [
    {
      name: 'list',
      type: 'array',
      of: [{ type: 'ProcessComponent_List' }],
      title: 'Lista',
      description: 'Lista elementów procesu, które zostaną wyświetlone na stronie w tej samej kolejności',
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      list: 'list',
    },
    prepare({ list }) {
      return {
        title: `[${title}] - ${list.length} elementów`,
        icon,
      };
    },
  },
};

export const ProcessComponent_List = {
  name: 'ProcessComponent_List',
  title: 'ProcessComponent List',
  type: 'object',
  fields: [
    {
      name: 'img',
      type: 'image',
      title: 'Zdjęcie',
    },
    {
      name: 'paragraph',
      type: 'markdown',
      title: 'Paragraf',
    },
  ],
  preview: {
    select: {
      media: 'img',
      title: 'paragraph',
    },
    prepare({ title, media }) {
      return {
        title: `${title ? title : 'Brak opisu'}`,
        media,
      };
    },
  },
};
