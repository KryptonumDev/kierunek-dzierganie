import { HeroSimple_Title } from "../../components/HeroSimple";

const title = 'Strona pomocy'
const icon = () => '❓';

export default {
  name: 'Support_Page',
  type: 'document',
  title,
  icon,
  fields: [
    {
      name: 'HeroSimple',
      type: 'HeroSimple',
      title: HeroSimple_Title,
      options: { collapsible: true, collapsed: true },
      validation: Rule => Rule.required(),
    },
    {
      name: 'tabs',
      type: 'array',
      of: [
        {
          type: 'Support_Page_Tabs',
        }
      ],
      title: 'Zakładki',
      validation: Rule => Rule.required(),
    },
    {
      name: 'seo',
      type: 'seo',
      title: 'SEO',
      group: 'seo',
    },
  ],
  groups: [
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
};

export const Support_Page_Tabs = {
  name: 'Support_Page_Tabs',
  type: 'object',
  title: 'Zakładki',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Nazwa zakładki',
      validation: Rule => Rule.required(),
    },
    {
      name: 'content',
      type: 'array',
      title: 'Zawartość',
      of: [
        {
          type: 'block'
        }
      ],
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      name: 'name',
    },
    prepare({ name }) {
      return {
        title: name,
      };
    },
  },
};