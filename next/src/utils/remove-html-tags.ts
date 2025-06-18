export const removeHtmlTags = (data?: string) => data?.replace(/<[^>]*>/g, '');
