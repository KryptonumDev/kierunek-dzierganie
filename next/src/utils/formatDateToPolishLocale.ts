export const formatDateToPolishLocale = (date: string) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  } as const;
  const data = new Date(date).toLocaleDateString('pl-PL', options);
  return data;
};