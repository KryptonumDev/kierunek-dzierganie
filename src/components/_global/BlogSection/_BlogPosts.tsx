import { notFound, redirect } from 'next/navigation';
import sanityFetch from '@/utils/sanity.fetch';
import Img, { Img_Query } from '@/components/ui/image';
import Markdown from '@/components/ui/markdown';
import styles from './BlogSection.module.scss';
import { type BlogPostsType } from './BlogSection.types';
import Link from 'next/link';
import { POSTS_PER_PAGE } from '@/global/constants';

export default async function BlogPosts({ slug, number }: { slug?: string; number?: number }) {
  if (number == 1) {
    return redirect('/blog');
  }
  let blogPosts: BlogPostsType[] = [];
  const selectedPage = number ? number : 1;
  slug
    ? (blogPosts = await getCategoryBlogPostData(selectedPage, slug))
    : (blogPosts = await getBlogPostData(selectedPage));

  return (
    <div
      className={styles.blogPosts}
      id='wpisy'
    >
      {blogPosts.map(({ hero_Heading, hero_Paragraph, hero_Img, slug }, i) => (
        <Link
          key={i}
          className={styles.item}
          href={`/blog/${slug}`}
        >
          <Img
            data={hero_Img}
            sizes='(max-width: 499px) 100vw, (max-width: 999px) 50vw, 33vw'
          />
          <div>
            <Markdown.h3>{hero_Heading}</Markdown.h3>
            <Markdown>{hero_Paragraph}</Markdown>
          </div>
        </Link>
      ))}
    </div>
  );
}

async function getBlogPostData(selectedPage?: number) {
  const data = await sanityFetch<BlogPostsType[]>({
    query: /* groq */ `
      *[_type == "BlogPost_Collection"]
      [$POSTS_PER_PAGE * ($selectedPage-1)
      ...
      $POSTS_PER_PAGE+ ($POSTS_PER_PAGE * ($selectedPage-1))] {
        hero_Img {
          ${Img_Query}
        },
        hero_Heading,
        hero_Paragraph,
        "slug": slug.current
      }
    `,
    params: { selectedPage, POSTS_PER_PAGE },
    tags: ['BlogPost_Collection'],
  });
  if (data.length == 0) {
    return notFound();
  }
  return data;
}

async function getCategoryBlogPostData(selectedPage?: number, slug?: string) {
  const data = await sanityFetch<BlogPostsType[]>({
    query: /* groq */ `
      *[_type == "BlogPost_Collection" && $slug in category[]->slug.current]
      [$POSTS_PER_PAGE * ($selectedPage-1)
      ...
      $POSTS_PER_PAGE+ ($POSTS_PER_PAGE * ($selectedPage-1))]
       {
        hero_Img {
          ${Img_Query}
        },
        hero_Heading,
        hero_Paragraph,
        "slug": slug.current
      }
    `,
    params: { slug, selectedPage, POSTS_PER_PAGE },
    tags: ['BlogPost_Collection'],
  });
  if (data.length == 0) {
    return notFound();
  }
  return data;
}
