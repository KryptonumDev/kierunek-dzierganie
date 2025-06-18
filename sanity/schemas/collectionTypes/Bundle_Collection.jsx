import {
  ColumnImageSection,
  OrderedList,
  Standout,
  UnorderedList,
  TextSection,
} from '../components/Product_Components';

export default {
  name: 'bundle',
  title: 'Pakiety kursów',
  type: 'document',
  icon: () => '📦',
  fields: [
    {
      name: 'visible',
      type: 'boolean',
      title: 'Widoczny w sklepie',
      initialValue: true,
      validation: Rule => Rule.required(),
    },
    {
      name: 'name',
      type: 'string',
      title: 'Nazwa zestawu',
      validation: Rule => Rule.required(),
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'name',
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'excerpt',
      type: 'markdown',
      title: 'Krótki opis na karcie wyróżnionego produktu',
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
    },
    {
      name: 'basis',
      type: 'string',
      title: 'Rodzaj pakietu',
      options: {
        list: [
          {
            title: 'Pakiet kursów szydełkowania',
            value: 'crocheting',
          },
          {
            title: 'Pakiet kursów dziergania na drutach',
            value: 'knitting',
          },
        ],
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'price',
      type: 'number',
      title: 'Cena w groszach',
      validation: Rule => Rule.min(0).required(),
    },
    {
      name: 'discount',
      type: 'number',
      title: 'Cena w groszach po rabacie',
      validation: Rule => Rule.min(0),
    },
    {
      name: 'author',
      type: 'reference',
      to: [{ type: 'CourseAuthor_Collection' }],
      title: 'Autor kursów w pakiecie',
      validation: Rule => Rule.required(),
    },
    {
      name: 'categories',
      type: 'array',
      title: 'Kategorie kursów',
      of: [{ type: 'reference', to: [{ type: 'courseCategory' }] }],
      validation: Rule => Rule.required(),
    },
    {
      name: 'featuredVideo',
      type: 'string',
      title: 'Link do filmu wyróżniającego',
      description: 'Link do iframe',
    },
    {
      name: 'gallery',
      type: 'array',
      title: 'Galeria',
      of: [{ type: 'image', validation: Rule => Rule.required() }],
    },
    {
      name: 'complexity',
      type: 'string',
      title: 'Poziom',
      options: {
        list: [
          { title: 'Dla początkujących', value: 'dla-poczatkujacych' },
          { title: 'Dla średnio zaawansowanych', value: 'dla-srednio-zaawansowanych' },
          { title: 'Dla zaawansowanych', value: 'dla-zaawansowanych' },
        ],
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'courses',
      type: 'array',
      title: 'Powiązane kursy',
      of: [{ type: 'reference', to: [{ type: 'course' }] }],
      validation: Rule => Rule.min(0).required(),
    },
    {
      name: 'description',
      type: 'array',
      title: 'Opis',
      of: [ColumnImageSection, OrderedList, Standout, UnorderedList, TextSection],
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
