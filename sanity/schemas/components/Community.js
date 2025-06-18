import { removeMarkdown } from '../../utils/remove-markdown';

export default {
  name: 'Community',
  title: 'Społeczność Kierunek Dzierganie',
  type: 'object',
  fields: [
    {
      name: 'backgroundImage',
      type: 'image',
      title: 'Zdjęcie tła (opcjonalne)',
    },
    {
      name: 'heading',
      type: 'markdown',
      title: 'Nagłówek',
      validation: Rule => Rule.required(),
      initialValue: 'Zostań w świecie dziergania i szydełka na dłużej',
    },
    {
      name: 'paragraph',
      type: 'markdown',
      title: 'Paragraf',
      validation: Rule => Rule.required(),
      initialValue: 'Dołącz do grupy – bądź na bieżąco i twórz piękno razem z nami!',
    },
    {
      name: 'cta',
      type: 'cta',
      title: 'Wezywanie do działania (opcjonalnie)',
    },
  ],
  preview: {
    select: {
      heading: 'heading',
      paragraph: 'paragraph',
      backgroundImage: 'backgroundImage',
    },
    prepare({ heading, paragraph, backgroundImage }) {
      return {
        title: `[Sekcja społeczność] ${removeMarkdown(heading)}`,
        subtitle: `${removeMarkdown(paragraph)}`,
        icon: () => '👥',
        media: backgroundImage,
      };
    },
  },
};
