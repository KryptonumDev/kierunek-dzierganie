export const getCookie = (name: string): string | null => {
  const cookieString = document.cookie;
  const cookies = cookieString.split(';').map((cookie) => cookie.trim());

  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=') as [string, string];
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }

  return null;
};
