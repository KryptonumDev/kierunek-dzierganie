import ProductSlug from '../../components/ProductSlug';

import {
  ColumnImageSection,
  OrderedList,
  Standout,
  UnorderedList,
  TextSection,
} from '../components/Product_Components';

export default {
  name: 'product',
  title: 'Produkty fizyczne',
  type: 'document',
  icon: () => '🧶',
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
            title: 'Instrukcja',
            value: 'instruction',
          },
          {
            title: 'Pakiet materiałów',
            value: 'materials',
          },
          {
            title: 'Inne',
            value: 'other',
          },
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
      name: 'type',
      type: 'string',
      title: 'Typ produktu',
      options: {
        list: [
          {
            title: 'Fizyczny standardowy',
            value: 'physical',
          },
          {
            title: 'Fizyczny z wariantami',
            value: 'variable',
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
      hidden: ({ document }) => document.basis !== 'crocheting' && document.basis !== 'knitting',
    },
    {
      name: 'countInStock',
      type: 'number',
      title: 'Ilość w magazynie',
      validation: Rule =>
        Rule.min(0).custom((currentValue, { document }) => {
          if (document.type === 'physical' && currentValue === undefined) return 'To pole jest wymagane';
          return true;
        }),
      hidden: ({ document }) => document.type !== 'physical',
      group: 'configuration',
    },
    {
      name: 'parameters',
      type: 'array',
      title: 'Parametry',
      of: [{ type: 'productParameters' }],
      group: 'configuration',
    },
    {
      name: 'price',
      type: 'number',
      title: 'Cena w groszach',
      validation: Rule =>
        Rule.min(0).custom((currentValue, { document }) => {
          if (document.type === 'physical' && currentValue === undefined) return 'To pole jest wymagane';
          return true;
        }),
      hidden: ({ document }) => document.type !== 'physical',
      group: 'prices',
    },
    {
      name: 'discount',
      type: 'number',
      title: 'Cena w groszach po rabacie',
      validation: Rule => Rule.min(0),
      hidden: ({ document }) => document.type !== 'physical',
      group: 'prices',
    },
    {
      name: 'excerpt',
      type: 'markdown',
      title: 'Krótki opis na karcie wyróżnionego produktu',
      group: 'description',
    },
    {
      name: 'variants',
      type: 'array',
      title: 'Warianty',
      of: [{ type: 'productVariant' }],
      description:
        'Proszę upewnić się że każdy z wariantów ma wszystkie atrybuty, w przypadku gdy któryś z nich nie będzie miał takiego samego zestawu atrybutów jak pozostałe strona nię będzie działać prawidłowo!',
      hidden: ({ document }) => document.type !== 'variable',
      group: 'description',
    },
    {
      name: 'gallery',
      type: 'array',
      title: 'Galeria',
      of: [{ type: 'image', validation: Rule => Rule.required() }],
      validation: Rule =>
        Rule.custom((currentValue, { document }) => {
          if (document.type === 'physical' && currentValue === undefined) return 'To pole jest wymagane';
          return true;
        }),
      hidden: ({ document }) => document.type !== 'physical',
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
      hidden: ({ document }) => document.type !== 'physical',
      group: 'description',
    },
    {
      name: 'featuredVideo',
      type: 'string',
      title: 'Link do filmu wyróżniającego',
      description: 'Link do iframe',
      hidden: ({ document }) => document.type !== 'physical',
      group: 'description',
    },
    {
      name: 'libraryId',
      type: 'string',
      title: 'ID biblioteki (Bunny.net)',
      description: 'ID biblioteki bunny.net, Jeśli id nie zostanie wybrane, filmy będą pobierane z bilbioteki testowej',
    },
    {
      name: 'libraryApiKey',
      type: 'string',
      title: 'Klucz API biblioteki (Bunny.net)',
      description:
        'Klucz API biblioteki bunny.net, Jeśli klucz nie zostanie wybrany, filmy będą pobierane z bilbioteki testowej',
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
  preview: {
    select: {
      visible: 'visible',
      type: 'type',
      title: 'name',
      gallery: 'gallery',
      variants: 'variants',
      countInStock: 'countInStock',
      price: 'price',
      category: 'category.name',
      discount: 'discount',
    },
    prepare({ visible, type, title, gallery, variants, countInStock, price, discount }) {
      const variantsPrice = variants?.map(variant => variant.price);
      const arePricesEqual = variantsPrice?.every(price => price === variantsPrice[0]);
      return {
        title,
        subtitle:
          (visible ? 'Widoczny' : 'Ukryty') +
          ' | ' +
          (type === 'variable'
            ? variants?.reduce((acc, variant) => acc + variant.countInStock, 0)
            : countInStock > 0
              ? countInStock
              : 'Brak') +
          ' na stanie' +
          ' | ' +
          (!variants?.length > 0
            ? `${parseInt(price) / 100} zł`
            : arePricesEqual
              ? `${parseInt(variantsPrice[0]) / 100} zł`
              : `${Math.min(...variants.map(variant => parseInt(variant.price / 100)))} zł -
              ${Math.max(...variants.map(variant => parseInt(variant.price / 100)))} zł`) +
          (discount
            ? discount
              ? ` | rabat: ${parseInt(discount) / 100} zł`
              : ` | rabaty: ${Math.min(...variants.map(variant => parseInt(variant.discount / 100)))} zł -
              ${Math.max(...variants.map(variant => parseInt(variant.discount / 100)))} zł`
            : ''),
        media: gallery ? gallery[0] : variants[0].gallery[0],
      };
    },
  },
};
