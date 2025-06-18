import Markdown from '@/components/ui/markdown';
import styles from './BlogSection.module.scss';
import HighlightedPost from './_HighlightedPost';
import BlogPosts from './_BlogPosts';
import { type BlogSectionTypes } from './BlogSection.types';
import Pagination from '@/components/ui/Pagination';
import { POSTS_PER_PAGE } from '@/global/constants';

const BlogSection = async ({
  heading,
  paragraph,
  highlightedPost,
  blogPosts,
  slug,
  number,
  pathPrefix = '/blog',
}: BlogSectionTypes) => {
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
        highlightedPost={highlightedPost}
      />
      <Pagination
        currentPage={number}
        allElementsCount={blogPosts.length}
        elementsPerPage={POSTS_PER_PAGE}
        pathPrefix={pathPrefix}
        scrollTo='#wpisy'
      />
    </section>
  );
};

export default BlogSection;
