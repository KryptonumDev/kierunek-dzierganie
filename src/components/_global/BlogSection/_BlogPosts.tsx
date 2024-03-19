import Img, { Img_Query } from '@/components/ui/image';
import Markdown from '@/components/ui/markdown';
import sanityFetch from '@/utils/sanity.fetch';
import styles from './BlogSection.module.scss';
import { type BlogPostsType } from './BlogSection.types';

export default async function BlogPosts() {
  const blogPosts = await getBlogPostsData();
  return (
    <div className={styles.blogPosts}>
      {blogPosts.map((post, i) => (
        <div
          key={i}
          className={styles.item}
        >
          <Img
            data={post.hero_Img}
            sizes=''
          />
          <div>
            <Markdown.h3>{post.hero_Heading}</Markdown.h3>
            <Markdown>{post.hero_Paragraph}</Markdown>
          </div>
        </div>
      ))}
    </div>
  );
}

async function getBlogPostsData() {
  const data = await sanityFetch<BlogPostsType[]>({
    query: /* groq */ `
      *[_type=="BlogPost_Collection"][] {
        hero_Img {
          ${Img_Query}
        },
        hero_Heading,
        hero_Paragraph,
        "slug": slug.current
      }
    `,
  });
  return data;
}
