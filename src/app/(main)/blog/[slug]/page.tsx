import Hero, { Hero_Query } from '@/components/_blogPost/Hero';
import { Img_Query } from '@/components/ui/image';
import { BlogPostQueryProps } from '@/global/types';
import sanityFetch from '@/utils/sanity.fetch';

export default async function BlogPostPage({ params: { slug } }: { params: { slug: string } }) {
  const { hero, author, date } = await getData(slug);

  return (
    <>
      <Hero
        {...hero}
        author={author}
        date={date}
      />
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
  }`,
    params: { slug },
    tags: ['BlogPost_Collection'],
  });
  return data;
}
