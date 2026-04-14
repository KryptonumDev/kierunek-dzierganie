import { removeMarkdown } from '../../utils/remove-markdown';

const title = 'Sekcja kolumnowa (2-3 opcje)';
const icon = () => '🧶';

export default {
  name: 'ProductOptionsSection',
  type: 'object',
  title,
  icon,
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
    },
    {
      name: 'list',
      type: 'array',
      of: [{ type: 'ProductOptionsSection_Item' }, { type: 'ProductOptionsSection_NewsletterItem' }],
      title: 'Kolumny',
      validation: Rule => Rule.min(2).max(3).required(),
      description: 'Dodaj 2 lub 3 kolumny.',
    },
  ],
  preview: {
    select: {
      heading: 'heading',
      list: 'list',
    },
    prepare: ({ heading, list }) => {
      return {
        title: `[${title}] ${removeMarkdown(heading)}`,
        subtitle: `${list?.length || 0} opcji`,
        media: list?.[0]?.img,
      };
    },
  },
};

export const ProductOptionsSection_Item = {
  name: 'ProductOptionsSection_Item',
  title: 'Kolumna',
  type: 'object',
  fields: [
    {
      name: 'img',
      type: 'image',
      title: 'Zdjęcie',
      validation: Rule => Rule.required(),
    },
    {
      name: 'heading',
      type: 'markdown',
      title: 'Nagłówek',
      validation: Rule => Rule.required(),
    },
    {
      name: 'paragraph',
      type: 'markdown',
      title: 'Opis',
      validation: Rule => Rule.required(),
    },
    {
      name: 'cta',
      type: 'cta',
      title: 'Przycisk',
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      heading: 'heading',
      paragraph: 'paragraph',
      media: 'img',
      cta: 'cta',
    },
    prepare: ({ heading, paragraph, media, cta }) => {
      return {
        title: `${removeMarkdown(heading)}`,
        subtitle: `${removeMarkdown(paragraph)} (${cta?.text || 'bez CTA'})`,
        media,
      };
    },
  },
};

export const ProductOptionsSection_NewsletterItem = {
  name: 'ProductOptionsSection_NewsletterItem',
  title: 'Kolumna z formularzem',
  type: 'object',
  fields: [
    {
      name: 'img',
      type: 'image',
      title: 'Zdjęcie',
      validation: Rule => Rule.required(),
    },
    {
      name: 'heading',
      type: 'markdown',
      title: 'Nagłówek',
      validation: Rule => Rule.required(),
    },
    {
      name: 'paragraph',
      type: 'markdown',
      title: 'Opis (opcjonalny)',
    },
    {
      name: 'groupId',
      type: 'string',
      title: 'ID grupy z MailerLite (opcjonalne)',
      description:
        'Domyślnie grupa Newsletter (ID: 112582388). Po uzupełnieniu tego pola, użytkownik zapisze się do wskazanej grupy.',
    },
    {
      name: 'buttonLabel',
      type: 'string',
      title: 'Tekst przycisku (opcjonalny)',
      description: 'Jeśli pole pozostanie puste, użyjemy domyślnego tekstu przycisku.',
    },
    {
      name: 'dedicatedThankYouPage',
      title: 'Dedykowana strona podziękowania (opcjonalna)',
      type: 'reference',
      to: [{ type: 'thankYouPage' }],
      hidden: ({ document }) => {
        return document._type !== 'landingPage';
      },
    },
  ],
  preview: {
    select: {
      heading: 'heading',
      paragraph: 'paragraph',
      groupId: 'groupId',
      buttonLabel: 'buttonLabel',
      media: 'img',
    },
    prepare: ({ heading, paragraph, groupId, buttonLabel, media }) => {
      return {
        title: `${removeMarkdown(heading)}`,
        subtitle: paragraph
          ? `${removeMarkdown(paragraph)} (${buttonLabel || 'domyślny przycisk'}, ${groupId || 'domyślna grupa'})`
          : `Formularz newslettera (${buttonLabel || 'domyślny przycisk'}, ${groupId || 'domyślna grupa'})`,
        media,
      };
    },
  },
};
