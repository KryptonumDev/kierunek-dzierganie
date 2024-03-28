export const formatToOnlyDigits = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
  (event.target.value = event.target.value.replace(/\D/g, ''));
