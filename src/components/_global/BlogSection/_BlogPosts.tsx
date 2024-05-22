import { notFound, redirect } from 'next/navigation';
import sanityFetch from '@/utils/sanity.fetch';
import Img, { Img_Query } from '@/components/ui/image';
import Markdown from '@/components/ui/markdown';
import styles from './BlogSection.module.scss';
import { type HighlightedPostType, type BlogPostsType } from './BlogSection.types';
import Link from 'next/link';
import { POSTS_PER_PAGE } from '@/global/constants';
import ReadingTime from '@/components/ui/ReadingTime';

export default async function BlogPosts({
  slug,
  number,
  highlightedPost,
}: {
  slug?: string;
  number?: number;
  highlightedPost?: HighlightedPostType;
}) {
  if (number == 1) {
    return redirect('/blog');
  }
  let blogPosts: BlogPostsType[] = [];
  const selectedPage = number ? number : 1;
  slug
    ? (blogPosts = await getCategoryBlogPostData(selectedPage, slug, highlightedPost))
    : (blogPosts = await getBlogPostData(selectedPage, highlightedPost));

  return (
    <div
      className={styles.blogPosts}
      id='wpisy'
    >
      {blogPosts.map(({ hero: { heading, img, paragraph }, portableText, slug }, i) => (
        <div
          key={i}
          className={styles.item}
        >
          <Link
            key={i}
            className={styles.item}
            href={`/blog/${slug}`}
            aria-label={`blog ${heading}`}
          />
          <div className={styles.imageWrapper}>
            <Img
              data={img}
              sizes='(max-width: 499px) 100vw, (max-width: 999px) 50vw, 33vw'
            />
            <ReadingTime portableText={portableText} />
          </div>
          <div>
            <Markdown.h3>{heading}</Markdown.h3>
            <Markdown>{paragraph}</Markdown>
          </div>
        </div>
      ))}
    </div>
  );
}

async function getBlogPostData(selectedPage?: number, highlightedPost?: HighlightedPostType | null) {
  let data = await sanityFetch<BlogPostsType[]>({
    query: /* groq */ `
      *[_type == "BlogPost_Collection"]
      [$POSTS_PER_PAGE * ($selectedPage-1)
      ...
      $POSTS_PER_PAGE+ ($POSTS_PER_PAGE * ($selectedPage-1))] {
        portableText,
        hero {
          img {
            ${Img_Query}
          },
          heading,
          paragraph,
        },
        "slug": slug.current
      }
    `,
    params: { selectedPage, POSTS_PER_PAGE },
    tags: ['BlogPost_Collection'],
  });
  if (data.length == 0) {
    return notFound();
  }

  if (!highlightedPost) {
    data.shift();
  }

  if (highlightedPost) {
    data = data.filter((item) => item.slug == highlightedPost.slug);
  }

  return data;
}

async function getCategoryBlogPostData(
  selectedPage?: number,
  slug?: string,
  highlightedPost?: HighlightedPostType | null
) {
  let data = await sanityFetch<BlogPostsType[]>({
    query: /* groq */ `
      *[_type == "BlogPost_Collection" && $slug in category[]->slug.current]
      [$POSTS_PER_PAGE * ($selectedPage-1)
      ...
      $POSTS_PER_PAGE+ ($POSTS_PER_PAGE * ($selectedPage-1))]
       {
        portableText,
        hero {
          img {
            ${Img_Query}
          },
          heading,
          paragraph,
        },
          "slug": slug.current
      }
    `,
    params: { slug, selectedPage, POSTS_PER_PAGE },
    tags: ['BlogPost_Collection'],
  });
  if (data.length == 0) {
    return notFound();
  }
  if (!highlightedPost) {
    data.shift();
  }

  if (highlightedPost) {
    data = data.filter((item) => item.slug !== highlightedPost.slug);
  }
  return data;
}
