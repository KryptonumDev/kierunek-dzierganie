import { notFound, redirect } from 'next/navigation';
import sanityFetch from '@/utils/sanity.fetch';
import Img, { Img_Query } from '@/components/ui/image';
import Markdown from '@/components/ui/markdown';
import styles from './BlogSection.module.scss';
import { POSTS_PER_PAGE } from '@/global/constants';
import type { BlogPostsType } from './BlogSection.types';

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
