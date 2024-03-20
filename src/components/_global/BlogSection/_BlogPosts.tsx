import Img, { Img_Query } from '@/components/ui/image';
import Markdown from '@/components/ui/markdown';
import sanityFetch from '@/utils/sanity.fetch';
import styles from './BlogSection.module.scss';
import { type BlogPostsType } from './BlogSection.types';

export default async function BlogPosts({ slug }: { slug?: string }) {
  let blogPosts: BlogPostsType[] = [];
  slug ? (blogPosts = await getCategoryBlogPostData(slug)) : (blogPosts = await getBlogPostData());
  return (
    <div className={styles.blogPosts}>
      {blogPosts.map(({ hero_Heading, hero_Paragraph, hero_Img }, i) => (
        <div
          key={i}
          className={styles.item}
        >
          <Img
            data={hero_Img}
            sizes=''
          />
          <div>
            <Markdown.h3>{hero_Heading}</Markdown.h3>
            <Markdown>{hero_Paragraph}</Markdown>
          </div>
        </div>
      ))}
    </div>
  );
}

async function getBlogPostData() {
  const data = await sanityFetch<BlogPostsType[]>({
    query: /* groq */ `
      *[_type == "BlogPost_Collection"] {
        hero_Img {
          ${Img_Query}
        },
        hero_Heading,
        hero_Paragraph,
        "slug": slug.current
      }
    `,
    tags: ['BlogPost_Collection'],
  });
  return data;
}

async function getCategoryBlogPostData(slug?: string) {
  const data = await sanityFetch<BlogPostsType[]>({
    query: /* groq */ `
      *[_type == "BlogPost_Collection" && $slug in category[]->slug.current] {
        hero_Img {
          ${Img_Query}
        },
        hero_Heading,
        hero_Paragraph,
        "slug": slug.current
      }
    `,
    params: { slug },
    tags: ['BlogPost_Collection'],
  });
  return data;
}
