import type { ComponentProps } from '@/components/Components';
import type { HeroSimpleTypes } from '@/components/_global/HeroSimple';
import type { DescriptionTypes } from '@/components/_product/Description/Description';
import type { ReviewsTypes } from '@/components/_product/Reviews';
import type { TableOfContentTypes } from '@/components/_product/TableOfContent/TableOfContent.types';
import type { User } from '@supabase/supabase-js';

export type Complexity = 'dla-poczatkujacych' | 'dla-srednio-zaawansowanych' | 'dla-zaawansowanych';

export type CtaType = {
  href: string;
  text: string | React.ReactNode;
};

export type ImgType = {
  asset: {
    url: string;
    altText: string;
    metadata: {
      dimensions: {
        width: number;
        height: number;
      };
      lqip: string;
    };
  };
};

export type ProductCard = {
  _type: 'product' | 'course' | 'bundle';
  _id: string;
  basis: 'crocheting' | 'knitting';
  slug: string;
  name: string;
  excerpt?: string;
  price?: number;
  discount?: number;
  countInStock?: number;
  featuredVideo?: string;
  gallery?: ImgType;
  quantity: number | null;
  complexity?: Complexity;
  reviewsCount: number;
  rating: number;
  variant: {
    _id: string;
    name: string;
    price: number;
    discount: number;
    countInStock: number;
    featuredVideo: string;
    gallery: ImgType;
  } | null;
  variants: Array<{
    _id: string;
    name: string;
    price: number;
    discount: number;
    countInStock: number;
    featuredVideo: string;
    gallery: ImgType;
  }> | null;
  courses: Array<{
    _id: string;
  }>;
};

export type ProductVariant = {
  _id: string;
  name: string;
  price: number;
  discount: number;
  countInStock: number;
  attributes?: Array<{
    type: string;
    name: string;
    value: string;
  }>;
  featuredVideo: string;
  gallery: Array<ImgType>;
};

export type ProductPhysical = {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  countInStock: number;
  featuredVideo?: string;
  gallery: Array<ImgType>;
  rating: number;
  reviewsCount: number;
};

export type generateMetadataProps = {
  slug?: string;
  seo: {
    title: string;
    description: string;
  };
};

export type PageQueryProps = {
  name?: string;
  slug?: string;
  content: ComponentProps[];
} & generateMetadataProps;

export type BlogPageQueryProps = {
  HeroSimple: HeroSimpleTypes;
  categories_Heading: string;
  categories_Paragraph: string;
  blogPosts: {
    categories: {
      name: string;
      slug: string;
    }[];
  }[];
  blog_Heading: string;
  blog_Paragraph: string;
  blog_HighlightedPost: {
    hero: {
      heading: string;
      img: ImgType;
      paragraph: string;
    };
    author: {
      heading: string;
      paragraph: string;
      img: ImgType;
    };
  };
};

export type BlogPostQueryProps = {
  hero: {
    img: ImgType;
    heading: string;
    paragraph: string;
  };
  content: [];
  portableText: [];
  author: {
    img: ImgType;
    heading: string;
    paragraph: string;
  };
  date: string;
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

export type BlogCategoryPageQueryProps = {
  name: string;
  filteredBlogPosts: {
    categories: {
      name: string;
      slug: string;
    }[];
  }[];
} & BlogPageQueryProps;

export type Node = {
  children?: Node[];
  style?: string;
  text?: string;
  subheadings?: Node[];
  slug?: string;
  _type?: string;
  marks?: string;
  icon?: ImgType;
};

export type ProductPageQueryProps = {
  product: {
    name: string;
    slug: string;
    _id: string;
    type: string;
    variants: Array<ProductVariant>;
    gallery?: Array<ImgType>;
    featuredVideo?: string;
    price?: number;
    discount?: number;
    countInStock?: number;
    parameters: Array<{
      name: string;
      value: string;
    }>;
    rating: number;
    reviewsCount: number;
    description: DescriptionTypes[];
  } & ReviewsTypes;
};

export type ProductPageQuery = {
  data: ProductPageQueryProps;
  user: User | null;
};

export type CoursePageQueryProps = {
  product: {
    basis: string;
    name: string;
    slug: string;
    _id: string;
    type: string;
    gallery?: Array<ImgType>;
    featuredVideo?: string;
    price?: number;
    discount?: number;
    countInStock?: number;
    courses: ProductCard[];
    rating: number;
    reviewsCount: number;
    description: DescriptionTypes[];
    author: {
      name: string;
      slug: string;
      image: ImgType;
      description: string;
      countOfCourse: number;
    };
    relatedBundle:
      | null
      | ({
          courses: ProductCard[];
        } & ProductCard);
  } & TableOfContentTypes &
    ReviewsTypes;
  card: ProductCard;
  relatedCourses: ProductCard[];
};

export type CoursePageQuery = {
  data: CoursePageQueryProps;
  user: User | null;
  courses_progress?: CoursesProgress[];
};

export type generateStaticParamsProps = {
  slug: string;
};

export type generateBlogCategoryPageStaticParamsProps = {
  slug: string;
  number: string;
};

export type BlogsCategoryStaticParamsType = {
  categories: {
    name: string;
    slug: string;
  }[];
};

export type generateBlogPaginationStaticParamsProps = {
  number: string;
};

export type CoursesProgress = {
  id: number;
  course_id: string;
  owner_id: string;
  progress: {
    [key: string]: {
      [key: string]: {
        ended: boolean;
        notes: string | null;
      };
    };
  };
};

export type Course = {
  _id: string;
  name: string;
  slug: string;
  type: 'course' | 'program';
  chapters: {
    _id: string;
    chapterDescription: string;
    chapterName: string;
    chapterImage: ImgType;
    dateOfUnlock?: Date;
    lessons: {
      _id: string;
      name: string;
      video: string;
      lengthInMinutes: number;
      slug: string;
    }[];
  }[];
};

export type generateStaticParamsBlogPagination = {
  number: string;
}[];

export type Chapter = {
  _id: string;
  chapterDescription: string;
  chapterName: string;
  chapterImage: ImgType;
  lessons: {
    _id: string;
    title: string;
    name: string;
    video: string;
    lengthInMinutes: number;
    slug: string;
  }[];
};

export type Order = {
  id: string;
  amount: number;
  created_at: string;
  payment_method: string;
  products: {
    array: {
      id: string;
      name: string;
      price: number;
      quantity: number;
    }[];
  };
  billing: Billing;
  shipping: Shipping;
  orders_statuses: {
    id: string;
    status_name:
      | 'AWAITING PAYMENT'
      | 'PENDING'
      | 'COMPLETED'
      | 'REFUNDED'
      | 'CANCELLED'
      | 'AWAITING SEND'
      | 'PARCEL GENERATED'
      | 'SENDED';
    complete_percent: number;
  };
};

export type File = {
  asset: {
    url: string;
    size: number;
    originalFilename: string;
    _id: string;
  };
};

export type Billing = {
  nip: string;
  firstName: string;
  address1: string;
  city: string;
  country: string;
  postcode: string;
  phone: string;
  company: string;
  invoiceType: 'Osoba prywatna' | 'Firma';
};

export type Shipping = {
  firstName: string;
  address1: string;
  city: string;
  country: string;
  postcode: string;
  phone: string;
};

export type Discount = {
  amount: number;
  code: string;
  id: string;
  type: string;
  affiliatedBy: string | null;
};
