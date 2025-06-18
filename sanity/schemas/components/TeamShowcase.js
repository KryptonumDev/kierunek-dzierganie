import { removeMarkdown } from '../../utils/remove-markdown';

const title = 'Przedstawienie zespołu';
const icon = () => '👥';

export default {
  name: 'TeamShowcase',
  type: 'object',
  title,
  icon,
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
      validation: Rule => Rule.required(),
    },
    {
      name: 'list',
      type: 'array',
      of: [{ type: 'TeamShowcase_Item' }],
      title: 'Lista członków zespołu',
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
      heading: 'heading',
      subtitle: 'paragraph',
      media: 'list.0.img',
    },
    prepare({ heading, subtitle, media }) {
      return {
        title: `[${title}] ${removeMarkdown(heading)}`,
        subtitle: removeMarkdown(subtitle),
        media,
      };
    },
  },
};

export const TeamShowcase_Item = {
  name: 'TeamShowcase_Item',
  title: 'Członek zespołu',
  type: 'object',
  fields: [
    {
      title: 'Czy obraz powinien znajdować się po lewej stronie?',
      type: 'boolean',
      name: 'isLeftSide',
      initialValue: false,
      validation: Rule => Rule.required(),
    },
    {
      title: 'Tytuł',
      type: 'markdown',
      name: 'title',
      validation: Rule => Rule.required(),
    },
    {
      title: 'Opis',
      type: 'markdown',
      name: 'description',
      validation: Rule => Rule.required(),
    },
    {
      title: 'Zdjęcie członka zespołu',
      type: 'image',
      name: 'img',
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
      media: 'img',
    },
    prepare({ title, description, media }) {
      return {
        title: removeMarkdown(title),
        subtitle: removeMarkdown(description),
        media,
      };
    },
  },
};
