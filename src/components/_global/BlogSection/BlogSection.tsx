import Markdown from '@/components/ui/markdown';
import styles from './BlogSection.module.scss';
import HighlightedPost from './_HighlightedPost';
import BlogPosts from './_BlogPosts';
import { type BlogSectionTypes } from './BlogSection.types';

const BlogSection = async ({ data: { blog_Heading, blog_Paragraph, blog_HighlightedPost } }: BlogSectionTypes) => {
  return (
    <section className={styles['BlogSection']}>
      <header>
        <Markdown.h2>{blog_Heading}</Markdown.h2>
        <Markdown>{blog_Paragraph}</Markdown>
      </header>
      <HighlightedPost blog_HighlightedPost={blog_HighlightedPost} />
      <BlogPosts />
    </section>
  );
};

export default BlogSection;
