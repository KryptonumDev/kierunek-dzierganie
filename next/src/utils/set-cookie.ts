export const setCookie = (name: string, value: string, days: number = 1) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = days ? '; expires=' + date.toUTCString() : '';
  const cookieValue = encodeURIComponent(value || '');
  document.cookie = `${name}=${cookieValue}${expires}; path=/; SameSite=Strict`;
};
