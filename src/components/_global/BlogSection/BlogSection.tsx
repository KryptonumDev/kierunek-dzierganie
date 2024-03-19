import styles from './BlogSection.module.scss';
import type { BlogSectionTypes } from './BlogSection.types';

const BlogSection = ({ data }: BlogSectionTypes) => {
  return <section className={styles['BlogSection']}></section>;
};

export default BlogSection;
