import Markdown from '@/components/ui/markdown';
import styles from './CategoriesSection.module.scss';
import type { CategoriesSectionTypes } from './CategoriesSection.types';

const CategoriesSection = ({
  data: { categories_Heading, categories_Paragraph, categories },
}: CategoriesSectionTypes) => {
  console.log(categories);
  return (
    <section className={styles['CategoriesSection']}>
      <Markdown.h2>{categories_Heading}</Markdown.h2>
      <Markdown>{categories_Paragraph}</Markdown>
    </section>
  );
};

export default CategoriesSection;
