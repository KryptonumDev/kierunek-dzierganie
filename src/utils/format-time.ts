export const formatTime = (time: number) => {
  const seconds = time / 1000;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.ceil((seconds % 3600) / 60);

  const lastDigitOfHours = parseInt(hours.toString().slice(-1));

  console.log(lastDigitOfHours);

  if (hours === 0) {
    return `${minutes} ${minutes === 1 ? 'minutę' : minutes < 5 ? 'minuty' : 'minut'}`;
  }

  if (hours > 0 && hours < 20) {
    return `${hours} godzin`;
  }

  if (hours >= 20) {
    return `${hours} ${lastDigitOfHours === 1 ? 'godzin' : lastDigitOfHours < 5 && lastDigitOfHours != 0 ? 'godziny' : 'godzin'}`;
  }
  if (minutes === 0) {
    return `${hours} ${hours === 1 ? 'godzinę' : hours < 5 ? 'godziny' : 'godzin'}`;
  }

  return `${hours} ${hours === 1 ? 'godzinę' : hours < 5 ? 'godziny' : 'godzin'} i ${minutes} ${minutes === 1 ? 'minutę' : minutes < 5 ? 'minuty' : 'minut'}`;
};
