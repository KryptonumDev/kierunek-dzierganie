export const removeMarkdown = (markdown: string) => markdown?.replace(/\*\*(.*?)\*\*/g, '$1')
