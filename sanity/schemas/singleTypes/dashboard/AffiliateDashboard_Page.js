const title = 'Strona program lojalnościowy'
const icon = () => '🎁';

export default {
  name: 'AffiliateDashboard_Page',
  type: 'document',
  title,
  icon,
  fields: [
    {
      name: 'subscribed',
      type: 'object',
      title: 'Zasubskrybowany',
      options: { collapsible: true, collapsed: true },
      fields: [
        {
          name: 'hero',
          type: 'object',
          title: 'Sekcja HERO',
          fields: [
            {
              name: 'heading',
              type: 'markdown',
              title: 'Nagłówek',
              description: 'Możesz użyć zmiennej ${name}, aby pokazać w tym miejscu imię kursantki.',
              validation: Rule => Rule.required(),
            },
          ],
        },
        {
          name: 'AffiliateCode',
          type: 'AffiliateDashboardPage_AffiliateCode',
          title: 'Sekcja kod afiljacyjny',
        },
      ],
    },
    {
      name: 'unsubscribed',
      title: 'Nie zasubskrybowany',
      options: { collapsible: true, collapsed: true },
      type: 'object',
      fields: [
        {
          name: 'hero',
          type: 'AffiliateDashboardPage_TextSection',
          title: 'Sekcja tekstowa',
        },
        {
          name: 'explainer',
          type: 'AffiliateDashboardPage_TextSection',
          title: 'Sekcja tekstowa',
        },
        {
          name: 'AffiliateCode',
          type: 'AffiliateDashboardPage_AffiliateCode',
          title: 'Sekcja kod afiljacyjny',
        },
        {
          name: 'simplicity',
          type: 'AffiliateDashboardPage_TextSection',
          title: 'Sekcja tekstowa',
        },
        {
          name: 'instructions',
          type: 'AffiliateDashboardPage_TextSection',
          title: 'Sekcja tekstowa',
        },
      ],
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

export const AffiliateDashboardPage_AffiliateCode = {
  name: 'AffiliateDashboardPage_AffiliateCode',
  type: 'object',
  title: 'Sekcja kod afiljacyjny',
  fields: [
    {
      name: 'heading',
      type: 'markdown',
      title: 'Nagłówek',
      validation: Rule => Rule.required(),
    },
    {
      name: 'paragraph',
      type: 'markdown',
      title: 'Paragraf',
      validation: Rule => Rule.required(),
    },
  ],
};

export const AffiliateDashboardPage_TextSection = {
  name: 'AffiliateDashboardPage_TextSection',
  type: 'object',
  title: 'Sekcja tekstowa',
  fields: [
    {
      name: 'heading',
      type: 'markdown',
      title: 'Nagłówek',
      validation: Rule => Rule.required(),
    },
    {
      name: 'paragraph',
      type: 'markdown',
      title: 'Paragraf',
      validation: Rule => Rule.required(),
    },
  ],
};