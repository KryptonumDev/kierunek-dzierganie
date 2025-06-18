export type PortableContentTypes = {
  data: [];
  previousBlog?: {
    slug: string;
    name: string;
  };
  nextBlog?: {
    slug: string;
    name: string;
  };
  links: {
    facebook: string;
    pinterest: string;
  };
};
