import { removeMarkdown } from '../../utils/remove-markdown';

export default {
  name: 'FaqCollection',
  title: 'Zbiór elementów FAQ',
  type: 'document',
  icon: () => '❓',
  fields: [
    {
      name: 'question',
      type: 'markdown',
      title: 'Pytanie',
      validation: Rule => Rule.required(),
    },
    {
      name: 'answer',
      type: 'markdown',
      title: 'Odpowiedź',
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      question: 'question',
      answer: 'answer',
    },
    prepare({ question, answer }) {
      return {
        title: removeMarkdown(question),
        subtitle: removeMarkdown(answer),
      };
    },
  },
};
