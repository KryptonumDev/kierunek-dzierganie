/**
 * Global declaration of themeColor in HEX format.
 * @constant
 */
export const themeColor: string = '#FAF4F0';

/**
 * Global declaration of backgroundColor in HEX format.
 * @constant
 */
export const backgroundColor: string = '#FDFBF8';

/**
 * Global declaration of page language.
 * @constant
 */
export const locale: string = 'pl';

/**
 * Global declaration of domain name of the website. Be aware of the protocol and www or non-www prefix.
 * @constant
 */
export const domain: string = 'https://kierunekdzierganie.pl';

/**
 * Global declaration of regex.
 * @constant
 */
export const regex: { email: RegExp; phone: RegExp } = {
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  phone: /^(?:\+(?:\d{1,3}))?(?:[ -]?\(?\d{1,4}\)?[ -]?\d{1,5}[ -]?\d{1,5}[ -]?\d{1,6})$/,
};
