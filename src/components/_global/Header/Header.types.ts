import type { Billing, Discount, ImgType, ProductCard, Shipping } from '@/global/types';
import type { Item } from 'react-use-cart';

export type useCartItems = {
  cart: Item[] | null;
  fetchedItems: Array<ProductCard> | null;
  updateItemQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
};

export type QueryProps = {
  markdownNavAnnotation: JSX.Element;
  global: {
    image_knitting: ImgType;
    image_crochet: ImgType;
    nav_Annotation?: string;
    nav_Links: {
      name: string;
      href?: string;
      sublinks?: {
        img?: ImgType;
        name: string;
        href: string;
      }[];
    }[];
  };
  cart: {
    highlighted: Array<ProductCard>;
  };
  ChevronDownIcon: React.ReactNode;
  ChevronBackIcon: React.ReactNode;
  SearchIcon: React.ReactNode;
  CloseIcon: React.ReactNode;
  Logo: React.ReactNode;
  CrossIcon: React.ReactNode;

  userEmail?: string;
  shipping?: Shipping;
  billing?: Billing;
  virtualWallet: number;
};

export type EmptyCart = {
  image_crochet: ImgType;
  image_knitting: ImgType;
};

export type Cart = {
  goToCheckout: () => void;
  setShowCart: () => void;
  showCart?: boolean;
  image_knitting: ImgType;
  image_crochet: ImgType;
  highlighted_products?: Array<ProductCard>;
  CrossIcon: React.ReactNode;
  virtualWallet: number;
  setUsedVirtualMoney: React.Dispatch<React.SetStateAction<number | null>>;
  setUsedDiscount: React.Dispatch<React.SetStateAction<Discount | null>>;
  usedVirtualMoney: number | null;
  usedDiscount: Discount | null;
} & useCartItems;

export type Grid = {
  updateItemQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  cart: Item[] | null;
  fetchedItems: ProductCard[] | null;
};

export type CartForm = {
  isDiscount: boolean;
  isVirtual: boolean;
  discount: string;
  virtual: string;
};

export type _NavProps = {
  links: {
    name: string;
    href?: string;
    sublinks?: {
      img?: ImgType;
      name: string;
      href: string;
    }[];
  }[];
  ChevronDownIcon: React.ReactNode;
  ChevronBackIcon: React.ReactNode;
  SearchIcon: React.ReactNode;
  CloseIcon: React.ReactNode;
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

export type SearchResultType = {
  courses: {
    course: {
      image: ImgType;
    };
    name: string;
    basis: 'crocheting' | 'knitting';
    slug: string;
  }[];
  physicalProducts: {
    gallery: ImgType;
    name: string;
    slug: string;
    basis: 'crocheting' | 'knitting';
  }[];
  variableProducts: {
    variants: {
      gallery: ImgType;
    };
    name: string;
    slug: string;
    basis: 'crocheting' | 'knitting';
  }[];
  blogPosts: {
    hero: {
      img: ImgType;
      heading: string;
    };
    slug: string;
  }[];
};
