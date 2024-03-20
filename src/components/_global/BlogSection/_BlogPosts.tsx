import Img, { Img_Query } from '@/components/ui/image';
import Markdown from '@/components/ui/markdown';
import sanityFetch from '@/utils/sanity.fetch';
import styles from './BlogSection.module.scss';
import { type BlogPostsType } from './BlogSection.types';
import { blogsPerPage } from 'app-config';
import { notFound, redirect } from 'next/navigation';

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
      [$blogsPerPage * ($selectedPage-1) 
      ...
      $blogsPerPage+ ($blogsPerPage * ($selectedPage-1))] {
        hero_Img {
          ${Img_Query}
        },
        hero_Heading,
        hero_Paragraph,
        "slug": slug.current
      }
    `,
    params: { selectedPage, blogsPerPage },
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
      [$blogsPerPage * ($selectedPage-1) 
      ...
      $blogsPerPage+ ($blogsPerPage * ($selectedPage-1))]
       {
        hero_Img {
          ${Img_Query}
        },
        hero_Heading,
        hero_Paragraph,
        "slug": slug.current
      }
    `,
    params: { slug, selectedPage, blogsPerPage },
    tags: ['BlogPost_Collection'],
  });
  if (data.length == 0) {
    return notFound();
  }
  return data;
}
