export const prettifyDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) {
    return `${remainingMinutes} min. oglądania`;
  } else if (remainingMinutes === 0) {
    return `${hours} godz. oglądania`;
  } else {
    return `${hours} godz. ${remainingMinutes} min. oglądania`;
  }
};
