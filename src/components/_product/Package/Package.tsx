import Markdown from '@/components/ui/markdown';
import styles from './Package.module.scss';
import type { PackageTypes } from './Package.types';
import ProductCard from '@/components/ui/ProductCard';

const Package = ({ product, heading, paragraph }: PackageTypes) => {
  return (
    <section className={`${styles['Package']} sec-wo-margin`}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        <Markdown className={styles.paragraph}>{paragraph}</Markdown>
      </header>
      <div className={styles.list}>
        <ProductCard data={product} />
      </div>
    </section>
  );
};

export default Package;
