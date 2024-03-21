import Markdown from '@/components/ui/markdown';
import styles from './BlogSection.module.scss';
import HighlightedPost from './_HighlightedPost';
import BlogPosts from './_BlogPosts';
import { type BlogSectionTypes } from './BlogSection.types';

const BlogSection = ({ heading, paragraph, highlightedPost, slug, number }: BlogSectionTypes) => {
  return (
    <section className={styles['BlogSection']}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        <Markdown>{paragraph}</Markdown>
      </header>
      <HighlightedPost
        highlightedPost={highlightedPost}
        slug={slug}
      />
      <BlogPosts
        slug={slug}
        number={number}
      />
      {/* <Pagination */}
    </section>
  );
};

export default BlogSection;
