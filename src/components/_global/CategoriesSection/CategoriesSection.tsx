import Markdown from '@/components/ui/markdown';
import styles from './CategoriesSection.module.scss';
import type { CategoriesSectionTypes } from './CategoriesSection.types';
import Link from 'next/link';

const CategoriesSection = ({
  data: { categories_Heading, categories_Paragraph, blogPosts },
}: CategoriesSectionTypes) => {
  const categoryNames = blogPosts.flatMap((post) => post.categories?.map((category) => category.name) || []);

  const categoryCounts = categoryNames.reduce(
    (counts: { [key: string]: number }, name: string) => {
      counts[name] = (counts[name] || 0) + 1;
      return counts;
    },
    {} as { [key: string]: number }
  );

  const allCategories = blogPosts.flatMap((post) => post.categories || []);

  const uniqueCategories = allCategories.filter(
    (category, index, self) => index === self.findIndex((c) => c.name === category.name)
  );

  return (
    <section className={styles['CategoriesSection']}>
      <Markdown.h2>{categories_Heading}</Markdown.h2>
      <Markdown>{categories_Paragraph}</Markdown>
      <div className={styles.categories}>
        {uniqueCategories.map(({ name, slug }) => (
          <Link
            href={`/blog/kategoria/${slug}`}
            key={name}
            className={styles.category}
          >
            {name} <span>({categoryCounts[name]})</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
