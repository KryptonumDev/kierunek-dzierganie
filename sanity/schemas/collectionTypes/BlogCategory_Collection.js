import { slugify } from '../../utils/slugify';
import { HeroSimple_Title } from '../components/HeroSimple';

const title = 'Zbiór kategorii bloga';
const icon = () => '📝';

export default {
  name: 'BlogCategory_Collection',
  type: 'document',
  title,
  icon,
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Nazwa kategorii',
      validation: Rule => Rule.required(),
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      description:
        'Slug, to unikalny ciąg znaków, który znajdziemy zazwyczaj po ukośniku w adresie URL podstrony. Dzięki niemu jego forma jest zrozumiała dla użytkowników.',
      options: {
        source: 'name',
        slugify: input => `${slugify(input)}`,
      },
      validation: Rule =>
        Rule.custom(({ current: slug }) => {
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
            return 'Slug może zawierać tylko małe litery, cyfry oraz łączniki. Upewnij się, że nie zawiera on znaków specjalnych ani wielkich liter.';
          }
          return true;
        }).required(),
    },
    {
      name: 'HeroSimple',
      type: 'HeroSimple',
      title: HeroSimple_Title,
      options: { collapsible: true, collapsed: true },
      validation: Rule => Rule.required(),
    },
    {
      name: 'categories_Heading',
      type: 'markdown',
      title: 'Nagłówek',
      validation: Rule => Rule.required(),
      fieldset: 'categories',
    },
    {
      name: 'categories_Paragraph',
      type: 'markdown',
      title: 'Paragraf',
      validation: Rule => Rule.required(),
      fieldset: 'categories',
    },
    {
      name: 'blog_Heading',
      type: 'markdown',
      title: 'Nagłówek',
      validation: Rule => Rule.required(),
      fieldset: 'blog',
    },
    {
      name: 'blog_Paragraph',
      type: 'markdown',
      title: 'Paragraf',
      validation: Rule => Rule.required(),
      fieldset: 'blog',
    },
    {
      name: 'blog_HighlightedPost',
      type: 'reference',
      to: [{ type: 'BlogPost_Collection' }],
      title: 'Wyróżniony post',
      description:
        'Gdy nie zostanie wybrany żaden blog, zostanie wyświetlony ostatni dodany post z tej samej kategorii.',
      fieldset: 'blog',
    },
    {
      name: 'seo',
      type: 'seo',
      title: 'SEO',
      group: 'seo',
    },
  ],
  fieldsets: [
    {
      name: 'categories',
      title: 'Sekcja z kategoriami bloga',
      options: { collapsible: true, collapsed: true },
    },
    {
      name: 'blog',
      title: 'Sekcja z postami bloga',
      options: { collapsible: true, collapsed: true },
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'slug.current',
    },
  },
  groups: [
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
};
