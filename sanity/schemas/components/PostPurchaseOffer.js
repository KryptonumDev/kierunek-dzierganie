import { removeMarkdown } from '../../utils/remove-markdown';

const PRODUCT_SECTION_TYPE = 'postPurchaseProductOfferSection';
const NEWSLETTER_SECTION_TYPE = 'postPurchaseNewsletterSignupSection';

const isFilled = (value) => typeof value === 'string' && value.trim().length > 0;

const productSection = {
  name: PRODUCT_SECTION_TYPE,
  title: 'Sekcja produktów',
  type: 'object',
  fields: [
    {
      name: 'heading',
      type: 'markdown',
      title: 'Nagłówek sekcji (opcjonalny)',
    },
    {
      name: 'paragraph',
      type: 'markdown',
      title: 'Paragraf sekcji (opcjonalny)',
    },
    {
      name: 'offeredItems',
      title: 'Oferowane produkty',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'course' }, { type: 'bundle' }] }],
      validation: Rule =>
        Rule.custom((value) => {
          if (!value || value.length === 0) return 'Dodaj co najmniej jeden produkt do sekcji';
          return true;
        }),
    },
    {
      name: 'offerMode',
      type: 'string',
      title: 'Tryb oferty',
      initialValue: 'discounted',
      options: {
        list: [
          { title: 'Oferta z rabatem', value: 'discounted' },
          { title: 'Oferta bez rabatu', value: 'standard' },
        ],
        layout: 'radio',
      },
    },
    {
      name: 'discountAmount',
      type: 'number',
      title: 'Wysokość rabatu w groszach',
      description: 'Wymagane tylko dla sekcji produktów z rabatem.',
      hidden: ({ parent }) => (parent?.offerMode ?? 'discounted') === 'standard',
      validation: Rule =>
        Rule.custom((value, context) => {
          const offerMode = context.parent?.offerMode ?? 'discounted';
          if (offerMode === 'discounted' && (value === undefined || value === null)) {
            return 'Wymagane gdy sekcja produktów ma rabat';
          }
          if (value !== undefined && value !== null && value <= 0) return 'Rabat musi być większy od 0';
          return true;
        }),
    },
    {
      name: 'discountTimeMinutes',
      type: 'number',
      title: 'Czas trwania oferty w minutach (opcjonalne)',
      description: 'Zostaw puste, aby oferta z rabatem była bezterminowa.',
      hidden: ({ parent }) => (parent?.offerMode ?? 'discounted') === 'standard',
      validation: Rule =>
        Rule.custom((value) => {
          if (value !== undefined && value !== null && (!Number.isInteger(value) || value <= 1)) {
            return 'Wartość musi być liczbą całkowitą większą od 1';
          }
          return true;
        }),
    },
  ],
  preview: {
    select: {
      heading: 'heading',
      paragraph: 'paragraph',
      offerMode: 'offerMode',
      items: 'offeredItems',
    },
    prepare({ heading, paragraph, offerMode, items }) {
      const title = heading ? removeMarkdown(heading) : `Sekcja produktów (${items?.length || 0})`;
      const subtitle = paragraph
        ? removeMarkdown(paragraph)
        : offerMode === 'standard'
          ? 'Produkty bez rabatu'
          : 'Produkty z rabatem';

      return {
        title,
        subtitle,
      };
    },
  },
};

const newsletterSection = {
  name: NEWSLETTER_SECTION_TYPE,
  title: 'Sekcja newslettera',
  type: 'object',
  fields: [
    {
      name: 'heading',
      type: 'markdown',
      title: 'Nagłówek sekcji (opcjonalny)',
    },
    {
      name: 'paragraph',
      type: 'markdown',
      title: 'Paragraf sekcji (opcjonalny)',
    },
    {
      name: 'groupId',
      type: 'string',
      title: 'ID grupy MailerLite (opcjonalne)',
      description:
        'Jeśli pole pozostanie puste, użyjemy domyślnej grupy newsletterowej. Darmowy produkt wysyła automatyzacja MailerLite.',
    },
    {
      name: 'image',
      type: 'image',
      title: 'Obrazek sekcji (opcjonalny)',
      description: 'Opcjonalny obrazek wyświetlany obok formularza newslettera.',
    },
  ],
  preview: {
    select: {
      heading: 'heading',
      paragraph: 'paragraph',
      groupId: 'groupId',
      media: 'image',
    },
    prepare({ heading, paragraph, groupId, media }) {
      return {
        title: heading ? removeMarkdown(heading) : 'Sekcja newslettera',
        subtitle: paragraph
          ? removeMarkdown(paragraph)
          : groupId
            ? `Grupa: ${groupId}`
            : 'Formularz zapisu do newslettera',
        media,
      };
    },
  },
};

const validateSections = (value, context) => {
  if (!context.parent?.enabled) return true;
  if (!value || value.length === 0) return 'Dodaj co najmniej jedną sekcję oferty';

  const discountedSections = value.filter(
    (section) => section?._type === PRODUCT_SECTION_TYPE && (section.offerMode ?? 'discounted') === 'discounted'
  );

  if (discountedSections.length > 1) {
    return 'Możesz dodać maksymalnie jedną sekcję produktów z rabatem';
  }

  const hasValidSection = value.some((section) => {
    if (!section?._type) return false;

    if (section._type === PRODUCT_SECTION_TYPE) {
      return Array.isArray(section.offeredItems) && section.offeredItems.length > 0;
    }

    if (section._type === NEWSLETTER_SECTION_TYPE) {
      return true;
    }

    return false;
  });

  if (!hasValidSection) {
    return 'Dodaj przynajmniej jedną poprawnie uzupełnioną sekcję produktów lub newslettera';
  }

  return true;
};

export default {
  name: 'postPurchaseOffer',
  title: 'Oferta po zakupie',
  type: 'object',
  description: 'Skonfiguruj sekcje wyświetlane użytkownikowi zaraz po zakupie.',
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
        'Włącz, aby po zakupie tego produktu wyświetlała się dedykowana strona z podziękowaniem i dodatkowymi sekcjami.',
      initialValue: false,
    },
    {
      name: 'sections',
      title: 'Sekcje oferty',
      type: 'array',
      hidden: ({ parent }) => !parent?.enabled,
      of: [productSection, newsletterSection],
      validation: Rule => Rule.custom(validateSections),
    },
  ],
};
