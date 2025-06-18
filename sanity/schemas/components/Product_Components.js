import { countItems } from '../../utils/count-items';
import { removeMarkdown } from '../../utils/remove-markdown';

export const ColumnImageSection = {
  name: 'ColumnImageSection',
  title: 'Sekcja z obrazkiem w kolumnie',
  type: 'object',
  fields: [
    {
      name: 'isReversed',
      type: 'boolean',
      title: 'Czy sekcja ma być odwrócona?',
      description: 'Jeśli zaznaczone zdjęcie będzie po prawej stronie, a tekst po lewej.',
      initialValue: false,
      validation: Rule => Rule.required(),
    },
    {
      name: 'heading',
      type: 'markdown',
      title: 'Nagłówek (opcjonalny)',
    },
    {
      name: 'suhheading',
      type: 'markdown',
      title: 'Podnagłówek (opcjonalny)',
    },
    {
      name: 'paragraph',
      type: 'markdown',
      title: 'Paragraf',
      validation: Rule => Rule.required(),
    },
    {
      name: 'img',
      type: 'image',
      title: 'Zdjęcie',
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      heading: 'heading',
      suhheading: 'suhheading',
      paragraph: 'paragraph',
      media: 'img',
    },
    prepare({ heading, suhheading, paragraph, media }) {
      return {
        title: removeMarkdown(heading) || removeMarkdown(suhheading),
        subtitle: removeMarkdown(paragraph),
        media,
      };
    },
  },
};
export const OrderedList = {
  name: 'OrderedList',
  title: 'Sekcja z listą numerowaną',
  type: 'object',
  fields: [
    {
      name: 'heading',
      type: 'markdown',
      title: 'Nagłówek',
      validation: Rule => Rule.required(),
    },
    {
      name: 'list',
      type: 'array',
      of: [{ type: 'markdown' }],
      title: 'Lista',
      validation: Rule => Rule.required(),
    },
    {
      name: 'paragraph',
      type: 'markdown',
      title: 'Paragraf (opcjonalnie)',
    },
  ],
  preview: {
    select: {
      heading: 'heading',
      list: 'list',
    },
    prepare({ heading, list }) {
      return {
        title: removeMarkdown(heading),
        subtitle: countItems(list.length),
      };
    },
  },
};
export const UnorderedList = {
  name: 'UnorderedList',
  title: 'Sekcja z listą nienumerowaną',
  type: 'object',
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
      title: 'Paragraf (opcjonalnie)',
    },
  ],
  preview: {
    select: {
      heading: 'heading',
      paragraph: 'paragraph',
    },
    prepare({ heading, paragraph }) {
      return {
        title: removeMarkdown(heading),
        subtitle: removeMarkdown(paragraph),
      };
    },
  },
};
export const Standout = {
  name: 'Standout',
  title: 'Sekcja wyróżniona',
  type: 'object',
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
  preview: {
    select: {
      heading: 'heading',
      paragraph: 'paragraph',
    },
    prepare({ heading, paragraph }) {
      return {
        title: removeMarkdown(heading),
        subtitle: removeMarkdown(paragraph),
      };
    },
  },
};
export const TextSection = {
  name: 'TextSection',
  title: 'Sekcja tekstowa',
  type: 'object',
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
    {
      name: 'secondParagraph',
      type: 'markdown',
      title: 'Drugi paragraf (opcjonalnie)',
    },
  ],
  preview: {
    select: {
      heading: 'heading',
      paragraph: 'paragraph',
    },
    prepare({ heading, paragraph }) {
      return {
        title: removeMarkdown(heading),
        subtitle: removeMarkdown(paragraph),
      };
    },
  },
};