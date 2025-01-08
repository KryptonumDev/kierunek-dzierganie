export const encodeEmail = (email: string) => {
  // Simple encryption by shifting characters
  const shifted = email
    .split('')
    .map((char) => String.fromCharCode(char.charCodeAt(0) + 3))
    .join('');
  return Buffer.from(shifted).toString('base64');
};

export const decodeEmail = (encoded: string) => {
  // Decrypt by shifting characters back
  const decoded = Buffer.from(encoded, 'base64').toString();
  return decoded
    .split('')
    .map((char) => String.fromCharCode(char.charCodeAt(0) - 3))
    .join('');
};
