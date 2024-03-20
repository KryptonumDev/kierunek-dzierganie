import Img, { Img_Query } from '@/components/ui/image';
import styles from './BlogSection.module.scss';
import { type HighlightedPostType } from './BlogSection.types';
import Markdown from '@/components/ui/markdown';
import sanityFetch from '@/utils/sanity.fetch';

export default async function HighlightedPost({
  blog_HighlightedPost,
  slug,
}: {
  blog_HighlightedPost: HighlightedPostType;
  slug?: string;
}) {
  if (!blog_HighlightedPost) {
    slug
      ? (blog_HighlightedPost = await getNewestCategoryBlogData(slug))
      : (blog_HighlightedPost = await getNewestBlogData());
  }
  const {
    hero_Img,
    hero_Heading,
    hero_Paragraph,
    hero_Author: { heading, img, paragraph },
  } = blog_HighlightedPost;
  return (
    <div className={styles.highlightedPost}>
      <Img
        data={hero_Img}
        sizes=''
      />
      <div className={styles.highlightedPostContent}>
        <div>
          <Markdown.h3>{hero_Heading}</Markdown.h3>
          <Markdown>{hero_Paragraph}</Markdown>
        </div>
        <div className={styles.author}>
          <Img
            data={img}
            sizes=''
          />
          <div>
            <Markdown.h3>{heading}</Markdown.h3>
            <Markdown>{paragraph}</Markdown>
          </div>
        </div>
      </div>
    </div>
  );
}

async function getNewestBlogData() {
  const data = await sanityFetch<HighlightedPostType>({
    query: /* groq */ `
      *[_type == "BlogPost_Collection"] | order(publishedAt desc) [0] {
        hero_Img {
          ${Img_Query}
        },
        hero_Heading,
        hero_Paragraph,
        hero_Author-> {
          heading,
          paragraph,
          img {
            ${Img_Query}
          },
        },
      }
    `,
    tags: ['BlogPost_Collection'],
  });
  return data;
}

async function getNewestCategoryBlogData(slug: string) {
  const data = await sanityFetch<HighlightedPostType>({
    query: /* groq */ `
      *[_type == "BlogPost_Collection" && $slug in category[]->slug.current] | order(publishedAt desc) [0] {
        hero_Img {
          ${Img_Query}
        },
        hero_Heading,
        hero_Paragraph,
        hero_Author-> {
          heading,
          paragraph,
          img {
            ${Img_Query}
          },
        },
      }
    `,
    params: { slug },
    tags: ['BlogPost_Collection'],
  });
  return data;
}
