// import { HeroSimple_Title } from '../components/HeroSimple';
import { LogoSection_Title } from '../components/LogoSection';

export default {
  name: 'MaterialsPackages_Page',
  title: 'Pakiety materiałów',
  type: 'document',
  icon: () => '📦',
  fields: [
    {
      name: 'LogoSection',
      type: 'LogoSection',
      title: LogoSection_Title,
      options: { collapsible: true, collapsed: true },
      validation: Rule => Rule.required(),
    },
    {
      name: 'listing_Heading_Courses',
      type: 'markdown',
      title: 'Nagłówek dla listy produktów',
      fieldset: 'listing',
    },
    {
      name: 'listing_Paragraph',
      type: 'markdown',
      title: 'Paragraf dla listy produktów',
      fieldset: 'listing',
    },
    {
      name: 'listing_HighlightedCourse_Badge',
      type: 'string',
      title: 'Odznaka dla wyróżnionego produktu',
      fieldset: 'listing',
      validation: Rule => Rule.required(),
    },
    {
      name: 'listing_HighlightedCourse',
      type: 'reference',
      title: 'Wyróżniony produkt',
      to: [{ type: 'product' }],
      fieldset: 'listing',
      options: {
        filter: '_type == "product" && basis == "knitting" && visible == true',
      },
    },
    {
      name: 'LatestBlogEntries',
      type: 'LatestBlogEntries',
      title: 'Najnowsze wpisy bloga',
      options: { collapsible: true, collapsed: true },
    },
    {
      name: 'seo',
      type: 'seo',
      title: 'SEO',
    },
  ],
  fieldsets: [
    {
      name: 'content',
      title: 'Zawartość podstrony',
      options: { collapsible: true, collapsed: true },
    },
    {
      name: 'listing',
      title: 'Lista wszystkich produktów',
      options: { collapsible: true, collapsed: true },
    },
  ],
};
