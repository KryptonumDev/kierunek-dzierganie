const title = 'Strona stan vouchera';
const icon = () => '📄';

export default {
  name: 'StanVouchera_Page',
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
