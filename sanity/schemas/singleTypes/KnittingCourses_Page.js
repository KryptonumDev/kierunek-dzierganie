// import { HeroSimple_Title } from '../components/HeroSimple';
import { LogoSection_Title } from '../components/LogoSection';
import { StepsGrid_Title } from '../components/StepsGrid';

export default {
  name: 'KnittingCourses_Page',
  title: 'Kursy dziergania',
  type: 'document',
  icon: () => '🪡',
  fields: [
    {
      name: 'LogoSection',
      type: 'LogoSection',
      title: LogoSection_Title,
      options: { collapsible: true, collapsed: true },
      validation: Rule => Rule.required(),
    },
    // Commented because of client preferences
    // {
    //   name: 'HeroSimple',
    //   type: 'HeroSimple',
    //   title: HeroSimple_Title,
    //   options: { collapsible: true, collapsed: true },
    //   validation: Rule => Rule.required(),
    // },
    {
      name: 'StepsGrid',
      type: 'StepsGrid',
      title: StepsGrid_Title,
      options: { collapsible: true, collapsed: true },
      validation: Rule => Rule.required(),
    },
    {
      name: 'listing_Heading_Courses',
      type: 'markdown',
      title: 'Nagłówek dla listy kursów',
      fieldset: 'listing',
    },
    {
      name: 'listing_Paragraph',
      type: 'markdown',
      title: 'Paragraf dla listy kursów',
      fieldset: 'listing',
    },
    {
      name: 'listing_HighlightedCourse_Badge',
      type: 'string',
      title: 'Odznaka dla wyróżnionego kursu',
      fieldset: 'listing',
      validation: Rule => Rule.required(),
    },
    {
      name: 'listing_HighlightedCourse',
      type: 'reference',
      title: 'Wyróżniony kurs',
      to: [{ type: 'course' }],
      fieldset: 'listing',
      options: {
        filter: '_type == "course" && basis == "knitting" && visible == true',
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
      title: 'Lista wszystkich kursów',
      options: { collapsible: true, collapsed: true},
    },
  ],
};
