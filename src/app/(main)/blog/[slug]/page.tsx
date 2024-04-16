import Components, { Components_Query } from '@/components/Components';
import Hero, { Hero_Query } from '@/components/_blogPost/Hero';
import PortableContent, { PortableContent_Query } from '@/components/_blogPost/PortableContent/PortableContent';
import { ShareArticle_Query } from '@/components/_blogPost/ShareArticle';
import { Img_Query } from '@/components/ui/image';
import { type BlogPostQueryProps } from '@/global/types';
import sanityFetch from '@/utils/sanity.fetch';

export default async function BlogPostPage({ params: { slug } }: { params: { slug: string } }) {
  const { hero, author, date, content, previousBlog, nextBlog, links, portableText } = await getData(slug);

  return (
    <>
      <Hero
        {...hero}
        author={author}
        date={date}
        portableText={portableText}
      />
      <PortableContent
        data={portableText}
        previousBlog={previousBlog}
        nextBlog={nextBlog}
        links={links}
      />
      <Components data={content} />
    </>
  );
}

async function getData(slug: string) {
  const data = await sanityFetch<BlogPostQueryProps>({
    query: /* groq */ `
    *[_type == "BlogPost_Collection" && slug.current == $slug][0] {
      "date": _createdAt,
      author-> {
        heading,
        paragraph,
        img {
          ${Img_Query}
        },
      },
      ${Hero_Query}
      ${PortableContent_Query}
      ${ShareArticle_Query}
      "previousBlog": *[_type == "BlogPost_Collection" && _createdAt < ^. _createdAt]|order(_createdAt desc)[0]{
        "slug": slug.current,
        "name" : hero.heading
      },
      "nextBlog": *[_type == "BlogPost_Collection" && _createdAt > ^. _createdAt]|order(_createdAt asc)[0]{
        "slug": slug.current,
        "name" : hero.heading
      },
      ${Components_Query}
  }`,
    params: { slug },
    tags: ['BlogPost_Collection'],
  });
  return data;
}
