import type { ComponentProps } from '@/components/Components';
import { CtaHeadingTypes } from '@/components/_courseDiscount/CtaHeading';
import { DiscountCtaTypes } from '@/components/_courseDiscount/DiscountCta';
import { DiscountHeroTypes } from '@/components/_courseDiscount/DiscountHero';
import { ImageHeadingTypes } from '@/components/_courseDiscount/ImageHeading';
import { TimerBoxTypes } from '@/components/_courseDiscount/TimerBox';
import type { HeroSimpleTypes } from '@/components/_global/HeroSimple';
import { AdditionalMaterialsTypes } from '@/components/_product/AdditionalMaterials';
import type { DescriptionTypes } from '@/components/_product/Description/Description';
import { MaterialsGroupsTypes } from '@/components/_product/MaterialsGroups';
import { MaterialsHeadingTypes } from '@/components/_product/MaterialsHeading/MaterialsHeading.types';
import { PartnerSalesTypes } from '@/components/_product/PartnerSales';
import { RelatedMaterialsTypes } from '@/components/_product/RelatedMaterials';
import type { ReviewsTypes } from '@/components/_product/Reviews';
import type { TableOfContentTypes } from '@/components/_product/TableOfContent/TableOfContent.types';

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
  _type: 'product' | 'course' | 'bundle' | 'voucher';
  _id: string;
  basis: 'crocheting' | 'knitting' | 'other' | 'instruction' | 'materials';
  slug: string;
  name: string;
  visible: boolean;
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
  needDelivery: boolean;
  automatizationId: string | null;
  materials_link?: {
    _id: string;
    gallery?: ImgType;
    name: string;
    price: number;
    rating: number;
    reviewsCount: number;
    countInStock: number;
    basis: 'knitting' | 'crocheting';
    slug: string;
    variants: Array<{
      _id: string;
      name: string;
      price: number;
      discount: number;
      countInStock: number;
      featuredVideo: string;
      gallery: ImgType;
    }> | null;
  };
  printed_manual?: {
    _id: string;
    gallery?: ImgType;
    name: string;
    price: number;
    rating: number;
    reviewsCount: number;
    countInStock: number;
    basis: 'knitting' | 'crocheting';
    slug: string;
    variants: Array<{
      _id: string;
      name: string;
      price: number;
      discount: number;
      countInStock: number;
      featuredVideo: string;
      gallery: ImgType;
    }> | null;
  };
  popup?: boolean;
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
    automatizationId: string;
  }>;
  related?: {
    _id: string;
    name: string;
  };
  voucherData?: {
    type: 'DIGITAL' | 'PHYSICAL';
    dedication: {
      from: string;
      to: string;
      message: string;
    } | null;
    amount: number;
  };
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
  basis: 'crocheting' | 'knitting' | 'other' | 'instruction' | 'materials';
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

export type ThankYouPageQueryProps = {
  name?: string;
  slug?: string;
  content: ComponentProps[];
  hasDiscount?: boolean;
  discountCourse?: DiscountCourseType;
  discountComponents: discountComponentsType;
} & generateMetadataProps;

export type DiscountCourseType = {
  course: DiscountCourseRefType;
  discount: number;
  discountTime: number;
};

export type DiscountCourseRefType = {
  basis: string;
  name: string;
  slug: string;
  _id: string;
  rating: number;
  reviewsCount: number;
  price: number;
  image: ImgType;
};

export type discountComponentsType = (
  | DiscountHeroTypes
  | TimerBoxTypes
  | ImageHeadingTypes
  | CtaHeadingTypes
  | DiscountCtaTypes
)[];

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
    portableText: [];
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
  content: ComponentProps[];
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
  OrganizationData: {
    OrganizationSchema: {
      name: string;
      description: string;
    };
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
    visible: boolean;
    name: string;
    slug: string;
    _type: 'product' | 'course' | 'bundle' | 'voucher';
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
    relatedCourses?: { _id: string }[];
    rating: number;
    reviewsCount: number;
    description: DescriptionTypes[];
  } & ReviewsTypes;
};

export type ProductPageQuery = {
  data: ProductPageQueryProps;
  user: string | undefined;
};

export type CoursePageQueryProps = {
  product: {
    basis: string;
    name: string;
    slug: string;
    _id: string;
    _type: 'product' | 'course' | 'bundle' | 'voucher';
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
    printed_manual: ProductCard;
    previewLessons?: {
      slug: string;
    };
    materialsPackage: MaterialsPackage;
    previewGroupMailerLite?: string;
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

export type ProductReference = {
  _id: string;
  slug: string;
  basis: 'knitting' | 'crocheting' | 'other' | 'instruction' | 'materials';
};

export type MaterialsPackage = (
  | MaterialsGroupsTypes
  | RelatedMaterialsTypes
  | PartnerSalesTypes
  | AdditionalMaterialsTypes
  | MaterialsHeadingTypes
)[];

export type CoursePageQuery = {
  data: CoursePageQueryProps;
  user: string | undefined;
  courses_progress?: CoursesProgress[];
};

export type generateStaticParamsProps = {
  slug: string;
  dedicatedThankYouPage?: {
    slug: string;
  };
};

export type generateLessonStaticParamsProps = {
  slug: string;
  previewLessons: {
    slug: string;
  }[];
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
  materials_link?: ProductCard;
  printed_manual?: ProductCard;
  _id: string;
  name: string;
  slug: string;
  generateCertificate: boolean;
  type: 'course' | 'program';
  files?: File[];
  files_alter?: File[];
  chapters: {
    _id: string;
    chapterDescription: string;
    chapterName: string;
    chapterImage: ImgType;
    dateOfUnlock?: Date;
    files?: File[];
    files_alter?: File[];
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
  profiles: {
    firstName: string;
  };
  bill?: string;
  products: {
    array: {
      complexity: Complexity;
      courses: ProductCard;
      discount: number;
      image: ImgType;
      type: 'product' | 'course' | 'bundle' | 'voucher';
      variantId: string;
      id: string;
      name: string;
      price: number;
      quantity: number;
    }[];
  };
  shippingMethod: {
    data: MapPoint | null;
    name: string;
    price: number;
  };
  virtualMoney?: number | null;
  discount?: Discount | null;
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
  email?: string;
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
  totalVoucherAmount: number | null;
  discounted_product: {
    id: string;
    name: string;
  };
  affiliatedBy: string | null;
};

export type MapPoint = {
  access_point_id: number;
  foreign_access_point_id: string;
  foreign_number: string | null;
  supplier: string;
  subtype: string | null;
  name: string;
  street: string;
  house_number: string | null;
  flat_number: string | null;
  line_1: string;
  line_2: string | null;
  postal_code: string;
  city: string;
  state_code: string | null;
  country_code: string;
  longitude: string;
  latitude: string;
  image_url: string | null;
  open_hours: {
    sat: string[][];
    tue: string[][];
    wed: string[][];
    thu: string[][];
    fri: string[][];
    mon: string[][];
  };
  services: string;
  services_sender: boolean;
  services_cod: boolean;
  services_receiver: boolean;
  additional_info: string;
  is_active: boolean;
  date_last_active: {
    date: string;
    timezone_type: number;
    timezone: string;
  };
};

declare global {
  function fbq(command: string, eventName: string, data?: object, options?: object): void;
}
