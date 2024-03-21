import { DOMAIN } from '@/global/constants';

const isExternalLink = (href?: string) =>
  href &&
  ((href.startsWith('https://') && !href.startsWith(DOMAIN)) || href.startsWith('mailto:') || href.startsWith('tel:'));

export default isExternalLink;
