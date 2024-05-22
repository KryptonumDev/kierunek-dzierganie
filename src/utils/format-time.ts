export const formatTime = (time: number) => {
  const seconds = time / 1000;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.ceil((seconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes} ${minutes === 1 ? 'minutę' : minutes < 5 ? 'minuty' : 'minut'}`;
  }

  if (hours > 6) {
    return `${hours} ${hours === 1 ? 'godzinę' : hours < 5 ? 'godziny' : 'godzin'}`;
  }

  if (minutes === 0) {
    return `${hours} ${hours === 1 ? 'godzinę' : hours < 5 ? 'godziny' : 'godzin'}`;
  }

  return `${hours} ${hours === 1 ? 'godzinę' : hours < 5 ? 'godziny' : 'godzin'} i ${minutes} ${minutes === 1 ? 'minutę' : minutes < 5 ? 'minuty' : 'minut'}`;
};
