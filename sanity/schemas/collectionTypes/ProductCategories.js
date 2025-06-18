export default {
  name: 'productCategory',
  title: 'Kategorie produktów',
  type: 'document',
  icon: () => '📝',
  fields: [
    {
      name: 'visibleInKnitting',
      type: 'boolean',
      title: 'Widoczny na podstronie dziergania',
      initialValue: true,
      validation: Rule => Rule.required(),
    },
    {
      name: 'imageKnitting',
      type: 'image',
      title: 'Obrazek pokazowy (dzierganie)',
      hidden: ({ document }) => !document.visibleInKnitting,
    },
    {
      name: 'visibleInCrocheting',
      type: 'boolean',
      title: 'Widoczny na podstronie szydełkowania',
      initialValue: true,
      validation: Rule => Rule.required(),
    },
    {
      name: 'imageCrocheting',
      type: 'image',
      title: 'Obrazek pokazowy (szydełkowanie)',
      hidden: ({ document }) => !document.visibleInCrocheting,
    },
    {
      name: 'name',
      type: 'string',
      title: 'Nazwa',
    },
    {
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name',
      },
      title: 'Slug',
      validation: Rule => Rule.required(),
    },
  ],
};
