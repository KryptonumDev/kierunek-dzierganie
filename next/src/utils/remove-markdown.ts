export const removeMarkdown = (markdown: string) => {
  return markdown?.replace(/\*\*(.*?)\*\*/g, '$1');
};
