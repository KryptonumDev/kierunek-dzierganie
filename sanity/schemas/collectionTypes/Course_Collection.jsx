import CourseSlug from '../../components/CourseSlug';
import { removeMarkdown } from '../../utils/remove-markdown';
import postPurchaseOffer from '../components/PostPurchaseOffer';

import {
  ColumnImageSection,
  OrderedList,
  Standout,
  TextSection,
  UnorderedList,
} from '../components/Product_Components';

const accessModeOptions = [
  { title: 'Bez ograniczenia czasu', value: 'unlimited' },
  { title: 'Przez określoną liczbę miesięcy od zakupu', value: 'duration_months' },
  { title: 'Do wskazanej daty', value: 'fixed_date' },
];

export default {
  name: 'course',
  title: 'Kursy',
  type: 'document',
  icon: () => '📚',
  fields: [
    {
      name: 'visible',
      type: 'boolean',
      title: 'Widoczny w sklepie',
      initialValue: true,
      validation: Rule => Rule.required(),
      group: 'configuration',
    },
    { name: 'name', type: 'string', title: 'Nazwa kursu', validation: Rule => Rule.required(), group: 'configuration' },
    {
      name: 'slug',
      type: 'slug',
      options: { source: 'name' },
      components: { input: CourseSlug },
      title: 'Slug',
      validation: Rule => Rule.required(),
      group: 'configuration',
    },
    {
      name: 'basis',
      type: 'string',
      title: 'Rodzaj kursu',
      options: {
        list: [
          { title: 'Szydełkowanie', value: 'crocheting' },
          { title: 'Dzierganie na drutach', value: 'knitting' },
        ],
      },
      validation: Rule => Rule.required(),
      group: 'configuration',
    },
    {
      name: 'type',
      type: 'string',
      title: 'Typ kursu',
      options: {
        list: [
          { title: 'Kurs', value: 'course' },
          { title: 'Program', value: 'program' },
        ],
      },
      initialValue: 'course',
      validation: Rule => Rule.required(),
      group: 'configuration',
    },
    {
      name: 'category',
      type: 'reference',
      title: 'Kategoria',
      to: [{ type: 'courseCategory' }],
      validation: Rule => Rule.required(),
      group: 'configuration',
    },
    { title: 'Długość kursu', name: 'courseLength', type: 'string', group: 'configuration' },
    {
      name: 'materials_link',
      title: 'Dodatkowe materiały',
      type: 'reference',
      to: [{ type: 'product' }],
      group: 'configuration',
    },
    {
      name: 'related_products',
      title: 'Produkty powiązane',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      group: 'configuration',
    },
    {
      name: 'printed_manual',
      title: '⚠️ Instrukcja drukowana (DANE LEGACY)',
      type: 'reference',
      to: [{ type: 'product' }],
      description: 'UWAGA: To pole zawiera dane z starej platformy. Aby mieć pełną kontrolę nad powiązaniami produktów, przenieś tę wartość do pola "Produkty powiązane" powyżej i wyczyść to pole. Dopóki to pole jest wypełnione, użytkownicy muszą posiadać kurs aby kupić ten produkt.',
      group: 'configuration',
    },
    {
      name: 'files',
      type: 'array',
      title: 'Pliki do pobrania',
      of: [{ type: 'file' }],
      description: 'Pliki dostępne dla całego kursu lub programu, niezależnie od konkretnej lekcji.',
      group: 'configuration',
    },
    {
      name: 'files_alter',
      type: 'array',
      title: 'Pliki do pobrania dla leworęcznych',
      of: [{ type: 'file' }],
      description:
        'Wersje plików dla osób leworęcznych, dostępne dla całego kursu lub programu.',
      group: 'configuration',
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
      group: 'configuration',
    },
    {
      name: 'author',
      type: 'reference',
      to: [{ type: 'CourseAuthor_Collection' }],
      title: 'Autor kursu',
      validation: Rule => Rule.required(),
      group: 'configuration',
    },
    {
      name: 'generateCertificate',
      type: 'boolean',
      title: 'Generuj certyfikat po ukończeniu kursu',
      initialValue: false,
      group: 'configuration',
    },
    {
      name: 'popup',
      type: 'boolean',
      title: 'Wyskakujące okienko po dodaniu do koszyka',
      description: 'Wyskakujące okienko z dodatkowymi materiałami oraz instrukcją drukowaną',
      initialValue: false,
      group: 'configuration',
    },
    {
      name: 'automatizationId',
      type: 'string',
      title: 'Identyfikator automatyzacji',
      description: 'ID grupy w automatyzacji MailerLite',
      group: 'configuration',
    },
    {
      name: 'grantedCourses',
      type: 'array',
      title: 'Kursy nadawane automatycznie',
      description:
        'Po zakupie użytkownik automatycznie otrzyma dostęp także do wskazanych kursów.',
      of: [
        {
          type: 'reference',
          to: [{ type: 'course' }],
          options: {
            filter: ({ document }) => {
              const courseId = document?._id?.replace('drafts.', '');

              if (!courseId) {
                return { filter: '_type == "course"' };
              }

              return {
                filter: '_type == "course" && _id != $courseId',
                params: { courseId },
              };
            },
          },
        },
      ],
      validation: Rule => Rule.unique(),
      group: 'configuration',
    },
    {
      name: 'shippingMode',
      type: 'string',
      title: 'Wysyłka po zakupie',
      description:
        'Jeśli kurs wymaga wysłania paczki (np. pakiet powitalny), wybierz wliczoną lub płatną dostawę. Kupujący zobaczy odpowiedni krok dostawy w koszyku.',
      options: {
        list: [
          { title: 'Brak', value: 'none' },
          { title: 'Wliczona w cenę', value: 'included' },
          { title: 'Płatna', value: 'paid' },
        ],
        layout: 'radio',
      },
      initialValue: 'none',
      validation: Rule => Rule.required(),
      group: 'shipping',
    },
    {
      name: 'shippingLabel',
      type: 'text',
      title: 'Tekst dla kupującego (koszyk / checkout)',
      description:
        'Krótki komunikat wyjaśniający, dlaczego przy zakupie kursu potrzebne są dane do wysyłki. Pole opcjonalne, ale zalecane przy wysyłce wliczonej lub płatnej.',
      rows: 3,
      hidden: ({ document }) => !document?.shippingMode || document.shippingMode === 'none',
      group: 'shipping',
    },
    {
      name: 'shipmentDeclaredValue',
      type: 'number',
      title: 'Deklarowana wartość zawartości przesyłki (w groszach)',
      description:
        'Opcjonalna deklarowana wartość zawartości paczki dla tego kursu. To NIE jest koszt dostawy dla kupującej, tylko wartość przesyłki używana operacyjnie np. przy deklaracji / zagubieniu / uszkodzeniu. Jeśli pole jest puste, sklep użyje wartości kursu.',
      hidden: ({ document }) => !document?.shippingMode || document.shippingMode === 'none',
      validation: Rule =>
        Rule.min(0).custom((value) => {
          if (value === undefined || value === null) return true;
          if (!Number.isInteger(value)) return 'Wpisz pełną kwotę w groszach';
          return true;
        }),
      group: 'shipping',
    },
    {
      name: 'accessMode',
      type: 'string',
      title: 'Sposób ograniczenia dostępu',
      description:
        'Określa, czy kurs ma być dostępny bez limitu, przez określoną liczbę miesięcy od zakupu, czy tylko do wybranej daty.',
      options: {
        list: accessModeOptions,
      },
      initialValue: 'unlimited',
      validation: Rule => Rule.required(),
      group: 'configuration',
    },
    {
      name: 'accessDurationMonths',
      type: 'number',
      title: 'Dostęp przez liczbę miesięcy od zakupu',
      description: 'Np. 6 oznacza dostęp przez 6 miesięcy liczonych od momentu zakupu przez użytkownika.',
      hidden: ({ document }) => document?.accessMode !== 'duration_months',
      validation: Rule =>
        Rule.custom((value, context) => {
          if (context.document?.accessMode !== 'duration_months') return true;
          if (value === undefined || value === null) return 'Podaj liczbę miesięcy dla ograniczenia czasowego';
          if (!Number.isInteger(value) || value <= 0) return 'Wpisz liczbę całkowitą większą od 0';
          return true;
        }),
      group: 'configuration',
    },
    {
      name: 'accessFixedDate',
      type: 'date',
      title: 'Dostęp do wskazanej daty',
      description: 'Po tej dacie użytkownik traci dostęp do kursu, nawet jeśli kupił go wcześniej.',
      hidden: ({ document }) => document?.accessMode !== 'fixed_date',
      validation: Rule =>
        Rule.custom((value, context) => {
          if (context.document?.accessMode !== 'fixed_date') return true;
          if (!value) return 'Wybierz datę końca dostępu';
          return true;
        }),
      group: 'configuration',
    },
    {
      name: 'price',
      type: 'number',
      title: 'Cena w groszach',
      validation: Rule =>
        Rule.min(0).custom((currentValue, { document }) => {
          if (document.type !== 'variable' && currentValue === undefined) return 'To pole jest wymagane';
          return true;
        }),
      group: 'prices',
    },
    {
      name: 'discount',
      type: 'number',
      title: 'Cena w groszach po rabacie',
      validation: Rule => Rule.min(0),
      group: 'prices',
    },
    { name: 'excerpt', type: 'markdown', title: 'Krótki opis na karcie wyróżnionego produktu', group: 'description' },
    {
      name: 'gallery',
      type: 'array',
      title: 'Galeria',
      of: [{ type: 'image', validation: Rule => Rule.required() }],
      group: 'description',
    },
    { name: 'chapters', type: 'array', title: 'Rozdziały', of: [{ type: 'ChapterList' }], group: 'description' },
    {
      name: 'description',
      type: 'array',
      title: 'Opis kursu',
      of: [ColumnImageSection, OrderedList, Standout, UnorderedList, TextSection],
      group: 'description',
    },
    {
      name: 'videoProvider',
      type: 'string',
      title: 'Dostawca wideo',
      description: 'Wybierz platformę hostingową dla tego filmu. Domyślnie dla nowych kursów i programów używamy Bunny.net.',
      options: {
        list: [
          { title: 'Vimeo', value: 'vimeo' },
          { title: 'YouTube', value: 'youtube' },
          { title: 'Bunny.net', value: 'bunnyNet' },
        ],
        layout: 'radio',
      },
      initialValue: 'bunnyNet',
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
      name: 'previewLessons',
      type: 'array',
      title: 'Podgląd kursu',
      of: [{ type: 'reference', to: [{ type: 'lesson' }], validation: Rule => Rule.required() }],
      group: 'preview',
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
      name: 'previewGroupMailerLite',
      type: 'string',
      title: 'Grupa w MailerLite',
      group: 'preview',
      description:
        'Grupa do której dodawane są osoby, które skorzystały z podglądu kursu, po kupieniu kursu automatycznie są usuwane z tej grupy',
    },
    {
      name: 'materialsPackage',
      type: 'array',
      title: 'Pakiet materiałów',
      of: [
        {
          name: 'materialsHeading',
          title: 'Nagłówek',
          type: 'object',
          fields: [
            {
              name: 'heading',
              title: 'Nagłówek',
              type: 'markdown',
              validation: Rule => Rule.required(),
              initialValue: 'Pakiet materiałów',
            },
            {
              name: 'paragraph',
              title: 'Paragraf (opcjonalny)',
              type: 'markdown',
              initialValue: 'Wszystkie materiały do tego kursu znajdziesz w jednym miejscu.',
            },
          ],
          preview: {
            select: { heading: 'heading' },
            prepare({ heading }) {
              return { title: 'Nagłówek', subtitle: removeMarkdown(heading) };
            },
          },
        },
        {
          name: 'materialsGroups',
          title: 'Grupy Materiałów',
          type: 'object',
          fields: [
            {
              name: 'heading',
              title: 'Nagłówek',
              type: 'markdown',
              validation: Rule => Rule.required(),
              initialValue: 'Zobacz, jakie materiały będą Ci potrzebne',
            },
            {
              name: 'materialsGroupsList',
              title: 'Lista grup materiałów',
              validation: Rule => Rule.required(),
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'materialsGroup',
                  title: 'Grupa Materiałów',
                  fields: [
                    { name: 'title', title: 'Nazwa Grupy', type: 'string' },
                    {
                      name: 'materialsList',
                      title: 'Lista Materiałów',
                      type: 'array',
                      validation: Rule => Rule.required(),
                      of: [
                        {
                          name: 'material',
                          title: 'Materiał',
                          type: 'object',
                          fields: [
                            { name: 'name', title: 'Nazwa Materiału', type: 'string' },
                            {
                              name: 'materialRef',
                              title: 'Referencja do produktu (opcjonalne)',
                              type: 'reference',
                              to: [{ type: 'product' }],
                              options: {
                                filter: ({ document }) => ({
                                  filter: 'basis == $basis',
                                  params: { basis: document.basis },
                                }),
                              },
                            },
                            { name: 'additionalInfo', title: 'Dodatkowa informacja (opcjonalna)', type: 'markdown' },
                          ],
                        },
                      ],
                    },
                    { name: 'additionalInfo', title: 'Dodatkowa informacja (opcjonalna)', type: 'markdown' },
                  ],
                },
              ],
            },
            {
              name: 'listParagraph',
              title: 'Paragraf pod listą',
              type: 'markdown',
              initialValue: 'Materiały możesz skompletować samodzielnie lub zamówić pakiet bezpośrednio u mnie ;)',
              validation: Rule => Rule.required(),
            },
          ],
          preview: {
            select: { heading: 'heading' },
            prepare({ heading }) {
              return { title: 'Grupy Materiałów', subtitle: removeMarkdown(heading) };
            },
          },
        },

        {
          name: 'dedicatedPackage',
          title: 'Dedykowany pakiet',
          type: 'object',
          fields: [
            {
              name: 'heading',
              title: 'Nagłówek',
              type: 'markdown',
              validation: Rule => Rule.required(),
              initialValue: 'Kup pakiet materiałów do tego kursu',
            },
            {
              name: 'paragraph',
              title: 'Paragraf',
              type: 'markdown',
              initialValue:
                'Nie chcesz kompletować materiałów samodzielnie? Wystarczy jeden klik, a w Twoim koszyku znajdzie się pakiet wszystkich potrzebnych materiałów do tego kursu.',
            },
            {
              name: 'materialRef',
              title: 'Referencja do materiału dedykowanego',
              type: 'reference',
              to: [{ type: 'product' }],
              validation: Rule => Rule.required(),
              options: {
                filter: ({ document }) => ({
                  filter: 'basis == $basis || basis == "materials"',
                  params: { basis: document.basis },
                }),
              },
            },
          ],
          preview: {
            select: { title: 'heading' },
            prepare({ title }) {
              return { title: 'Dedykowany pakiet', subtitle: removeMarkdown(title) };
            },
          },
        },
        {
          name: 'partnerSales',
          title: 'Rabaty partnerskie',
          type: 'object',
          fields: [
            {
              name: 'imageList',
              type: 'array',
              title: 'Lista zdjęć',
              of: [{ type: 'image' }],
              validation: Rule => Rule.max(3).required(),
            },
            {
              name: 'heading',
              title: 'Nagłówek',
              type: 'markdown',
              validation: Rule => Rule.required(),
              initialValue: 'Skorzystaj z rabatów partnerskich',
            },
            {
              name: 'paragraph',
              title: 'Paragraf',
              type: 'markdown',
              validation: Rule => Rule.required(),
              initialValue: 'Kupując kurs dostaniesz ode mnie kody rabatowe do sklepów:',
            },
            {
              name: 'salesList',
              title: 'Lista rabatów',
              type: 'array',
              validation: Rule => Rule.required().min(1),
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'shopName', title: 'Nazwa sklepu', type: 'string', validation: Rule => Rule.required() },
                    { name: 'shopLink', title: 'Link do sklepu (opcjonalny)', type: 'url' },
                    {
                      name: 'salePercentage',
                      title: 'Procent rabatu',
                      type: 'number',
                      validation: Rule => Rule.required().positive(),
                    },
                  ],
                },
              ],
            },
          ],
          preview: {
            select: { title: 'heading', subtitle: 'paragraph', imageList: 'imageList' },
            prepare({ title, subtitle, imageList }) {
              return {
                title: removeMarkdown(title) || 'Rabaty partnerskie',
                subtitle: removeMarkdown(subtitle),
                media: imageList && imageList.length > 0 ? imageList[0] : null,
              };
            },
          },
        },
        {
          name: 'additionalMaterials',
          title: 'Dodatkowe materiały',
          type: 'object',
          fields: [
            {
              name: 'heading',
              title: 'Nagłówek',
              type: 'markdown',
              validation: Rule => Rule.required(),
              initialValue: 'Te materiały mogą Cię zainteresować',
            },
            {
              name: 'additionalMaterialsList',
              title: 'Lista',
              type: 'array',
              of: [
                {
                  type: 'reference',
                  to: [{ type: 'product' }],
                },
              ],
              validation: Rule => Rule.max(3).required(),
            },
          ],
          preview: {
            select: { title: 'heading' },
            prepare({ title }) {
              return { title: 'Dodatkowe materiały', subtitle: removeMarkdown(title) };
            },
          },
        },
      ],
    },
    postPurchaseOffer,
    { name: 'seo', type: 'seo', title: 'SEO', group: 'seo' },
  ],
  groups: [
    { name: 'configuration', title: 'Konfiguracja' },
    { name: 'shipping', title: 'Wysyłka po zakupie' },
    { name: 'prices', title: 'Ceny' },
    { name: 'description', title: 'Treści' },
    { name: 'preview', title: 'Podgląd kursu' },
    { name: 'postPurchaseOffer', title: 'Oferta po zakupie' },
    { name: 'seo', title: 'SEO' },
  ],
  preview: {
    select: { name: 'name', gallery: 'gallery', price: 'price', discount: 'discount' },
    prepare({ name, gallery, price, discount }) {
      return {
        title: name,
        media: gallery[0],
        subtitle: `${parseInt(price / 100)} zł` + (discount ? ` | rabat: ${parseInt(discount / 100)} zł` : ''),
      };
    },
  },
};
