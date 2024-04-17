import Img, { Img_Query } from '@/components/ui/image';
import styles from './BlogSection.module.scss';
import { type HighlightedPostType } from './BlogSection.types';
import Markdown from '@/components/ui/markdown';
import sanityFetch from '@/utils/sanity.fetch';
import Link from 'next/link';

export default async function HighlightedPost({
  highlightedPost,
  slug,
}: {
  highlightedPost: HighlightedPostType;
  slug?: string;
}) {
  if (!highlightedPost) {
    slug ? (highlightedPost = await getNewestCategoryBlogData(slug)) : (highlightedPost = await getNewestBlogData());
  }
  const {
    hero,
    href,
    author: { img, paragraph },
  } = highlightedPost;

  return (
    <div className={styles.highlightedPost}>
      <Link href={`/blog/${href}`}>
        <Img
          data={hero.img}
          sizes='(max-width: 999px) 100vw, 50vw'
        />
      </Link>
      <div className={styles.highlightedPostContent}>
        <div>
          <Markdown.h3>{hero.heading}</Markdown.h3>
          <Markdown>{hero.paragraph}</Markdown>
        </div>
        <div className={styles.author}>
          <Img
            data={img}
            sizes='64px'
          />
          <div>
            <Markdown.h3>{'**Autor publikacji**'}</Markdown.h3>
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
        hero {
          img {
            ${Img_Query}
          },
          heading,
          paragraph,
        },
        "href": slug.current,
        author-> {
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
        hero {
          img {
            ${Img_Query}
          },
          heading,
          paragraph,
        },
        "href": slug.current,
        author-> {
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
