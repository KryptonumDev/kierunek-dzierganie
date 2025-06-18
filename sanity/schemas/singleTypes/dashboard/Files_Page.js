const title = 'Strona pliki do pobrania'
const icon = () => '💾';

export default {
  name: 'Files_Page',
  type: 'document',
  title,
  icon,
  fields: [
    {
      name: 'seo',
      type: 'seo',
      title: 'SEO',
      group: 'seo',
    },
  ],
  fieldsets: [
    {
      name: 'content',
      title: 'Zawartość podstrony',
      options: { collapsible: true },
    },
  ],
  groups: [
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
};
