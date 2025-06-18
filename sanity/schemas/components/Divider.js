export default {
  name: 'Divider',
  title: 'Rozdzielacz sekcji',
  type: 'object',
  icon: () => '⎼',
  fields: [
    {
      name: 'paragraph',
      type: 'string',
      title: 'Rozdzielacz sekcji',
      description:
        'To jest wizualny rozdzielacz sekcji, nie możesz go edytować. Możesz jedynie zmienić jego kolejność, lub go usunąć.',
      initialValue: ' ',
      readOnly: true,
    },
  ],
  preview: {
    prepare() {
      return {
        title: `[Rozdzielacz sekcji]`,
        media: () => '⎼',
      };
    },
  },
};
