export const formatPhoneNumber = (event: React.ChangeEvent<HTMLInputElement>) =>
  (event.target.value = event.target.value.replace(/[^\d+\-\s]/g, ''));
