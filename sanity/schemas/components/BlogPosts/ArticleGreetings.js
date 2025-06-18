import { removeMarkdown } from '../../../utils/remove-markdown';

const title = 'Pozdrowienia';
const icon = () => '👨‍💼';

export default {
  name: 'ArticleGreetings',
  type: 'object',
  title,
  icon,
  fields: [
    {
      name: 'author',
      type: 'reference',
      to: [{ type: 'Author_Collection' }],
      title: 'Autor',
      validation: Rule => Rule.required(),
    },
    {
      name: 'text',
      type: 'text',
      title: 'Tekst pozdrowień',
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      heading: 'author.name',
      subtitle: 'text',
      media: 'author.img',
    },
    prepare({ heading, subtitle, media }) {
      return {
        title: `[${title}] - ${removeMarkdown(heading)}`,
        subtitle,
        media,
      };
    },
  },
};
