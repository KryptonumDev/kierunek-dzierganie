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
  ownedCourses?: string[];
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
  Logo: React.ReactNode[];
  VirtualCoinsCrossIcon: React.ReactNode;
  NavigationCrossIcon: React.ReactNode;
  PopupCrossIcon: React.ReactNode;
  PromoCodeCrossIcon: React.ReactNode;
  userId?: string;
  userEmail?: string;
  shipping?: Shipping;
  billing?: Billing;
  virtualWallet: number;
  deliverySettings: {
    deliveryPrice: number;
    paczkomatPrice: number;
  } | null;
};

export type EmptyCart = {
  image_crochet: ImgType;
  image_knitting: ImgType;
  setShowCart: (variable: boolean) => void;
};

export type Cart = {
  ownedCourses?: string[];
  goToCheckout: () => void;
  setShowCart: () => void;
  setPopupState: (variable: boolean) => void;
  popupState: boolean;
  showCart?: boolean;
  image_knitting: ImgType;
  image_crochet: ImgType;
  highlighted_products?: Array<ProductCard>;
  NavigationCrossIcon: React.ReactNode;
  PopupCrossIcon: React.ReactNode;
  VirtualCoinsCrossIcon: React.ReactNode;
  PromoCodeCrossIcon: React.ReactNode;
  virtualWallet: number;
  setUsedVirtualMoney: React.Dispatch<React.SetStateAction<number | null>>;
  setUsedDiscount: React.Dispatch<React.SetStateAction<Discount | null>>;
  usedVirtualMoney: number | null;
  usedDiscount: Discount | null;
  userId?: string;
} & useCartItems;

export type Grid = {
  updateItemQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
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
    gallery: ImgType;
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
