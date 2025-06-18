import { contentArray } from '../../components/Content';

export default {
  name: 'thankYouPage',
  title: 'Strony podziękowania',
  type: 'document',
  icon: () => '🎉',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Name',
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'name',
      },
    },
    {
      name: 'hasDiscount',
      type: 'boolean',
      title: 'Czy ma rabat na kurs?',
      initialValue: false,
    },
    {
      name: 'content',
      type: 'content',
      title: 'Komponenty podstrony',
      hidden: ({ parent }) => parent?.hasDiscount,
    },
    {
      name: 'discountCourse',
      title: 'Kurs z rabatem',
      type: 'object',
      hidden: ({ parent }) => !parent?.hasDiscount,
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        {
          name: 'course',
          title: 'Referencja kursu',
          type: 'reference',
          to: [{ type: 'course' }],
          validation: Rule =>
            Rule.custom((value, context) => {
              if (context.parent && !value) return 'Required';
              return true;
            }),
        },
        {
          name: 'discount',
          type: 'number',
          title: 'Wielkość rabatu',
          description: 'Wielkość wyrażona w postaci groszach',
          validation: Rule =>
            Rule.custom(async (value, context) => {
              if (context.parent && !value) return 'Required';

              const courseRef = context.parent.course;
              if (courseRef && value) {
                // Fetch both price and discount from the course
                const course = await context
                  .getClient({ apiVersion: '2023-01-01' })
                  .fetch('*[_id == $id][0]{price, discount}', { id: courseRef._ref });

                // Use course's discount price if it exists, otherwise use regular price
                const referencePrice = course.discount || course.price;

                if (referencePrice && value >= referencePrice) {
                  return 'Rabat nie może być większy lub równy cenie kursu (z uwzględnieniem aktualnego rabatu kursu)';
                }
              }

              return true;
            }),
        },
        {
          name: 'discountTime',
          type: 'number',
          title: 'Czas trwania rabatu',
          description: 'Czas trwania rabatu w minutach',
          validation: Rule =>
            Rule.custom((value, context) => {
              if (context.parent && !value) return 'Required';
              if (value && (!Number.isInteger(value) || value <= 1)) {
                return 'Wartość musi być liczbą całkowitą większą od 1';
              }
              return true;
            }),
        },
      ],
    },
    {
      name: 'discountComponents',
      type: 'array',
      title: 'Komponenty sekcji z rabatem',
      description: 'Komponenty podstrony + komponenty sekcji z rabatem',
      hidden: ({ parent }) => !parent?.hasDiscount,
      of: [
        ...contentArray,
        { type: 'discountHero' },
        { type: 'timerBox' },
        { type: 'imageHeading' },
        { type: 'ctaHeading' },
        { type: 'discountCta' },
      ],
    },
    {
      name: 'seo',
      type: 'seo',
      title: 'SEO',
      group: 'seo',
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'slug.current',
    },
  },
  groups: [
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
};
