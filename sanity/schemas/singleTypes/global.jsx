import React from 'react';

export default {
  name: 'global',
  title: 'Globalne',
  type: 'document',
  icon: () => '🌍',
  fields: [
    {
      name: 'nav_Annotation',
      type: 'markdown',
      title: 'Baner w nawigacji (opcjonalne)',
      description: 'Staraj się nie przekraczać 100 znaków',
      fieldset: 'nav',
    },
    {
      name: 'nav_courses',
      type: 'object',
      title: 'Nawigacja - kursy',
      fieldset: 'nav',
      fields: [
        {
          name: 'knitting',
          title: 'Dzierganie na drutach',
          type: 'object',
          fields: [
            {
              name: 'href',
              type: 'string',
              title: 'Link relatywny',
              validation: Rule =>
                Rule.custom(value => {
                  if (value && !value.startsWith('/')) {
                    return 'Link musi być relatywny (zaczynający się od "/").';
                  }
                  if (!value) {
                    return 'Link jest wymagany';
                  }
                  return true;
                }),
            },
            {
              name: 'highlighted_courses',
              type: 'array',
              of: [
                {
                  type: 'reference',
                  to: [{ type: 'course' }],
                  options: {
                    filter: 'basis == "knitting" && visible == true',
                  },
                },
              ],
              title: 'Wyróżnione kursy',
              validation: Rule => Rule.max(6),
            },
          ],
          options: {
            collapsible: true,
            collapsed: false,
          },
        },
        {
          name: 'crocheting',
          title: 'Szydełkowanie',
          type: 'object',
          fields: [
            {
              name: 'href',
              type: 'string',
              title: 'Link relatywny',
              validation: Rule =>
                Rule.custom(value => {
                  if (value && !value.startsWith('/')) {
                    return 'Link musi być relatywny (zaczynający się od "/").';
                  }
                  if (!value) {
                    return 'Link jest wymagany';
                  }
                  return true;
                }).required(),
            },
            {
              name: 'highlighted_courses',
              type: 'array',
              of: [
                {
                  type: 'reference',
                  to: [{ type: 'course' }],
                  options: {
                    filter: 'basis == "crocheting" && visible == true',
                  },
                },
              ],
              title: 'Wyróżnione kursy',
              validation: Rule => Rule.max(6),
            },
          ],
          options: {
            collapsible: true,
            collapsed: false,
          },
        },
        {
          name: 'additional_links',
          title: 'Dodatkowe linki',
          type: 'array',
          of: [
            {
              type: 'nav_Link',
            },
          ],
          validation: Rule => Rule.max(4),
        },
      ],
    },
    {
      name: 'nav_products',
      type: 'object',
      title: 'Nawigacja - produkty',
      fieldset: 'nav',
      fields: [
        {
          name: 'knitting',
          title: 'Dzierganie na drutach',
          type: 'object',
          fields: [
            {
              name: 'href',
              type: 'string',
              title: 'Link relatywny',
              validation: Rule =>
                Rule.custom(value => {
                  if (value && !value.startsWith('/')) {
                    return 'Link musi być relatywny (zaczynający się od "/").';
                  }
                  if (!value) {
                    return 'Link jest wymagany';
                  }
                  return true;
                }),
            },
            {
              name: 'highlighted_products',
              type: 'array',
              of: [
                {
                  type: 'reference',
                  to: [{ type: 'productCategory' }],
                  options: {
                    filter: 'visibleInKnitting == true',
                  },
                },
              ],
              title: 'Wyróżnione kategorie',
              validation: Rule => Rule.max(6),
            },
          ],
          options: {
            collapsible: true,
            collapsed: false,
          },
        },
        {
          name: 'crocheting',
          title: 'Szydełkowanie',
          type: 'object',
          fields: [
            {
              name: 'href',
              type: 'string',
              title: 'Link relatywny',
              validation: Rule =>
                Rule.custom(value => {
                  if (value && !value.startsWith('/')) {
                    return 'Link musi być relatywny (zaczynający się od "/").';
                  }
                  if (!value) {
                    return 'Link jest wymagany';
                  }
                  return true;
                }).required(),
            },
            {
              name: 'highlighted_products',
              type: 'array',
              of: [
                {
                  type: 'reference',
                  to: [{ type: 'productCategory' }],
                  options: {
                    filter: 'visibleInCrocheting == true',
                  },
                },
              ],
              title: 'Wyróżnione kategorie',
              validation: Rule => Rule.max(6),
            },
          ],
          options: {
            collapsible: true,
            collapsed: false,
          },
        },
        {
          name: 'additional_links',
          title: 'Dodatkowe linki',
          type: 'array',
          of: [
            {
              type: 'nav_Link',
            },
          ],
          validation: Rule => Rule.max(4),
        },
      ],
    },
    {
      name: 'nav_Links',
      type: 'array',
      of: [
        {
          type: 'nav_Links',
        },
      ],
      title: 'Linki w nawigacji',
      validation: Rule => Rule.required().max(3),
      fieldset: 'nav',
    },
    {
      name: 'image_crochet',
      type: 'image',
      title: 'Zdjęcie szydełkowania',
      validation: Rule => Rule.required(),
      fieldset: 'products',
    },
    {
      name: 'image_knitting',
      type: 'image',
      title: 'Zdjęcie dziergania na drutach',
      validation: Rule => Rule.required(),
      fieldset: 'products',
    },
    {
      name: 'email',
      type: 'string',
      title: 'Adres e-mail',
      validation: Rule => Rule.required().email(),
    },
    {
      name: 'email_orders',
      type: 'string',
      title: 'Adres e-mail w sprawie zamówień',
    },
    {
      name: 'email_support',
      type: 'string',
      title: 'Adres e-mail w sprawie kwestii technicznych',
    },
    {
      name: 'tel',
      type: 'string',
      title: 'Numer telefonu',
    },
    {
      name: 'facebook',
      type: 'url',
      title: 'Facebook',
      validation: Rule => Rule.required().uri({ scheme: ['https'] }),
      fieldset: 'social',
    },
    {
      name: 'instagram',
      type: 'url',
      title: 'Instagram',
      validation: Rule => Rule.required().uri({ scheme: ['https'] }),
      fieldset: 'social',
    },
    {
      name: 'youtube',
      type: 'url',
      title: 'YouTube',
      validation: Rule => Rule.required().uri({ scheme: ['https'] }),
      fieldset: 'social',
    },
    {
      name: 'pinterest',
      type: 'url',
      title: 'Pinterest',
      validation: Rule => Rule.required().uri({ scheme: ['https'] }),
      fieldset: 'social',
    },
    {
      name: 'messenger',
      type: 'url',
      title: 'Messenger',
      validation: Rule => Rule.required().uri({ scheme: ['https'] }),
      fieldset: 'social',
    },
    {
      name: 'seo',
      type: 'global_Seo',
      title: 'Globalne SEO',
    },
    {
      name: 'mascots',
      type: 'object',
      title: 'Maskotki',
      fields: [
        {
          name: 'text',
          type: 'array',
          of: [{ type: 'string' }],
          title: 'Zbiór tekstów',
          validation: Rule => Rule.required(),
        },
        {
          name: 'image',
          type: 'array',
          of: [{ type: 'image' }],
          title: 'Zbiór zdjęć',
          validation: Rule => Rule.required(),
        },
      ],
      options: { collapsible: true, collapsed: true },
    },
    {
      type: 'global_OrganizationSchema',
      name: 'OrganizationSchema',
      title: 'Uporządkowane dane organizacji',
      description: (
        <a
          href='https://developers.google.com/search/docs/appearance/structured-data/organization?hl=pl'
          target='_blank'
          rel='noreferrer'
        >
          Więcej informacji o Schema
        </a>
      ),
      options: { collapsible: true, collapsed: true },
    },
  ],
  fieldsets: [
    {
      name: 'nav',
      title: 'Nawigacja',
      options: {
        collapsible: true,
      },
    },
    {
      name: 'social',
      title: 'Social linki',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
    {
      name: 'products',
      title: 'Obrazki linków do stron produktowych',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
  ],
};

export const global_Seo = {
  name: 'global_Seo',
  title: 'Global SEO',
  type: 'object',
  fields: [
    {
      name: 'og_Img',
      type: 'image',
      title: 'OG Image',
      description:
        'Zdjęcie, które jest widoczne przy udostępnianiu strony w mediach społecznościowych. Wymiary zdjęcia powinny mieć 1200x630px',
    },
  ],
};

export const global_OrganizationSchema = {
  name: 'global_OrganizationSchema',
  title: 'Global SEO',
  type: 'object',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Nazwa Twojej organizacji',
    },
    {
      name: 'description',
      type: 'text',
      rows: 3,
      title: 'Szczegółowy opis Twojej organizacji',
    },
  ],
};

export const nav_Links = {
  name: 'nav_Links',
  title: 'Linki w nawigacji',
  type: 'object',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Nazwa',
      validation: Rule => Rule.required(),
    },
    {
      name: 'href',
      type: 'string',
      title: 'Link relatywny',
      description: 'Jeśli nie jest uzupełniony to znaczy, że jest to zakładka.',
      validation: Rule =>
        Rule.custom(value => {
          if (value && !value.startsWith('/')) {
            return 'Link musi być relatywny (zaczynający się od "/").';
          }
          return true;
        }),
    },
    {
      name: 'sublinks',
      type: 'array',
      of: [
        {
          name: 'link',
          type: 'nav_Link',
        },
      ],
      hidden: ({ parent: { href } }) => href !== undefined,
    },
  ],
};

export const nav_Link = {
  name: 'nav_Link',
  title: 'Linki w nawigacji',
  type: 'object',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Nazwa',
      validation: Rule => Rule.required(),
    },
    {
      name: 'href',
      type: 'string',
      title: 'Link relatywny',
      validation: Rule =>
        Rule.custom(value => {
          if (value && !value.startsWith('/')) {
            return 'Link musi być relatywny (zaczynający się od "/").';
          }
          return true;
        }).required(),
    },
  ],
};
