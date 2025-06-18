import ProductSlug from '../../components/ProductSlug';

import {
  ColumnImageSection,
  OrderedList,
  Standout,
  UnorderedList,
  TextSection,
} from '../components/Product_Components';

export default {
  name: 'voucher',
  title: 'Vouchery',
  type: 'document',
  icon: () => '🎁',
  fields: [
    {
      name: 'visible',
      type: 'boolean',
      title: 'Widoczny w sklepie',
      initialValue: true,
      validation: Rule => Rule.required(),
      group: 'configuration',
    },
    {
      name: 'name',
      type: 'string',
      title: 'Nazwa produktu',
      validation: Rule => Rule.required(),
      group: 'configuration',
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'name',
      },
      components: {
        input: ProductSlug,
      },
      validation: Rule => Rule.required(),
      group: 'configuration',
    },
    {
      name: 'basis',
      type: 'string',
      title: 'Rodzaj produktu',
      options: {
        list: [
          {
            title: 'Produkt dla szydełkowania',
            value: 'crocheting',
          },
          {
            title: 'Produkt dla dziergania na drutach',
            value: 'knitting',
          },
        ],
      },
      validation: Rule => Rule.required(),
      group: 'configuration',
    },
    {
      name: 'category',
      type: 'reference',
      title: 'Kategoria',
      to: [
        {
          type: 'productCategory',
        },
      ],
      validation: Rule => Rule.required(),
      group: 'configuration',
    },
    {
      name: 'excerpt',
      type: 'markdown',
      title: 'Krótki opis na karcie wyróżnionego produktu',
      group: 'description',
    },
    {
      name: 'additionalInformation',
      type: 'array',
      title: 'Dodatkowe informacje o produkcie',
      of: [{ type: 'string' }],
      initialValue: ['Darmowy zwrot do 14 dni', 'Dostawa w ciągu 3 dni'],
      group: 'description',
    },
    {
      name: 'gallery',
      type: 'array',
      title: 'Galeria',
      of: [{ type: 'image', validation: Rule => Rule.required() }],
      group: 'description',
    },
    {
      name: 'description',
      type: 'array',
      title: 'Opis produktu',
      of: [ColumnImageSection, OrderedList, Standout, UnorderedList, TextSection],
      group: 'description',
    },
    {
      name: 'videoProvider',
      type: 'string',
      title: 'Dostawca wideo',
      description: 'Wybierz platformę hostingową dla tego filmu (brak wyboru oznacza Vimeo)',
      options: {
        list: [
          { title: 'Vimeo', value: 'vimeo' },
          { title: 'YouTube', value: 'youtube' },
          { title: 'Bunny.net', value: 'bunnyNet' },
        ],
        layout: 'radio',
      },
      initialValue: 'vimeo',
      group: 'description',
    },
    {
      name: 'featuredVideo',
      type: 'string',
      title: 'Link do filmu wyróżniającego',
      description: 'Link do iframe',
      group: 'description',
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
      name: 'package',
      title: 'Pakiet',
    },
  ],
  groups: [
    {
      name: 'configuration',
      title: 'KONFIGURACJA',
    },
    {
      name: 'prices',
      title: 'CENY',
    },
    {
      name: 'description',
      title: 'TREŚCI',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
};
