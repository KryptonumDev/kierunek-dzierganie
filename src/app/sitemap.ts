import { domain } from '../global/Seo';

export default function sitemap() {
  return [
    {
      url: `${domain}`,
      lastModified: new Date(),
    },
  ]
}