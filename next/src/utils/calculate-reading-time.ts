import { type PortableTextBlock, toPlainText } from '@portabletext/react';

export default function calculateReadingTime(content: PortableTextBlock) {
  const countWords = (text: string) => {
    const trimmedText = text.trim();
    if (trimmedText === '') {
      return 0;
    }
    const words = trimmedText.split(/\s+/);
    return words.length;
  };
  const plainText = toPlainText(content);
  const words = countWords(plainText);
  const wordsPerMinute = 200;
  const readingTime = Math.ceil(words / wordsPerMinute);
  return readingTime;
}
