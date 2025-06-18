export default {
  name: 'Cart',
  title: 'Koszyk',
  type: 'document',
  icon: () => '🛒',
  fields: [
    {
      name: 'highlighted',
      type: 'array',
      title: 'Wyróżnione produkty',
      of: [{ type: 'reference', to: [{ type: 'product' }, { type: 'course' }, { type: 'bundle' }] }],
      Rule: Rule => Rule.max(2).required(),
    },
  ],
};
