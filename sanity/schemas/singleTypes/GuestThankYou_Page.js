const title = 'Dziękujemy za zamówienie (Gość)';
const icon = () => '🎉';

export default {
  name: 'GuestThankYou_Page',
  type: 'document',
  title,
  description: 'Strona podziękowania specjalnie dla gości, którzy składają zamówienie bez rejestracji konta',
  icon,
  fields: [
    {
      name: 'content',
      type: 'content',
      title: 'Komponenty podstrony',
      fieldset: 'content',
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
