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
      name: 'postPurchaseOffer',
      title: 'Oferta po zakupie',
      type: 'object',
      description: 'Skonfiguruj ofertę specjalną wyświetlaną użytkownikowi zaraz po zakupie tego pakietu.',
      group: 'postPurchaseOffer',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        {
          name: 'enabled',
          type: 'boolean',
          title: 'Aktywna oferta po zakupie',
          description:
            'Włącz, aby po zakupie tego pakietu wyświetlała się dedykowana strona z podziękowaniem i ofertą specjalną.',
          initialValue: false,
        },
        {
          name: 'heading',
          type: 'markdown',
          title: 'Nagłówek oferty',
          description: 'Główny nagłówek wyświetlany w sekcji z ofertą (np. "Specjalna oferta tylko dla Ciebie!").',
          hidden: ({ parent }) => !parent?.enabled,
          validation: Rule =>
            Rule.custom((value, context) => {
              if (context.parent?.enabled && !value) return 'Wymagane gdy oferta jest aktywna';
              return true;
            }),
        },
        {
          name: 'paragraph',
          type: 'markdown',
          title: 'Paragraf oferty',
          description: 'Dodatkowy opis lub zachęta do skorzystania z oferty (opcjonalnie).',
          hidden: ({ parent }) => !parent?.enabled,
        },
        {
          name: 'offeredItems',
          title: 'Oferowane produkty',
          type: 'array',
          description: 'Kursy lub pakiety kursów, które mają być zaproponowane po zakupie.',
          hidden: ({ parent }) => !parent?.enabled,
          of: [{ type: 'reference', to: [{ type: 'course' }, { type: 'bundle' }] }],
          validation: Rule =>
            Rule.custom((value, context) => {
              if (context.parent?.enabled && (!value || value.length === 0))
                return 'Dodaj co najmniej jeden produkt do oferty';
              return true;
            }),
        },
        {
          name: 'discountAmount',
          type: 'number',
          title: 'Wysokość rabatu w groszach',
          description: 'Wartość rabatu wyrażona w groszach (np. 5000 = 50 zł). Rabat dotyczy każdego oferowanego produktu.',
          hidden: ({ parent }) => !parent?.enabled,
          validation: Rule =>
            Rule.custom((value, context) => {
              if (context.parent?.enabled && !value) return 'Wymagane gdy oferta jest aktywna';
              if (value !== undefined && value <= 0) return 'Rabat musi być większy od 0';
              return true;
            }),
        },
        {
          name: 'discountTimeMinutes',
          type: 'number',
          title: 'Czas trwania oferty w minutach (opcjonalne)',
          description: 'Po upływie tego czasu od momentu zakupu oferta wygaśnie (np. 30 = 30 minut). Zostaw puste, aby oferta była bezterminowa.',
          hidden: ({ parent }) => !parent?.enabled,
          validation: Rule =>
            Rule.custom((value) => {
              if (value !== undefined && value !== null && (!Number.isInteger(value) || value <= 1))
                return 'Wartość musi być liczbą całkowitą większą od 1';
              return true;
            }),
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
      name: 'postPurchaseOffer',
      title: 'Oferta po zakupie',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
};
