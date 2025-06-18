export default {
  name: 'AboutUs_Page',
  title: 'O nas',
  type: 'document',
  icon: () => '🙋‍♀️',
  fields: [
    {
      name: 'content',
      type: 'content',
      title: 'Komponenty podstrony',
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
