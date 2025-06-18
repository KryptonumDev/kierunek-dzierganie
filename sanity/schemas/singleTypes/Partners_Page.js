export default {
  name: 'Partners_Page',
  title: 'Partnerzy',
  type: 'document',
  icon: () => '🤝',
  fields: [
    {
      name: 'displayPage',
      type: 'boolean',
      title: 'Wyświetl stronę',
      initialValue: true,
    },
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
