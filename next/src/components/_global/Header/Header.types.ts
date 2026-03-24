import type { Discount, ImgType, ProductCard } from '@/global/types';
import { ReactNode } from 'react';
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
    nav_courses: NavCourses;
    nav_products: NavProducts;
  };
  cart: {
    highlighted: Array<ProductCard>;
  };
  counts: Counts;
  ChevronDownIcon: React.ReactNode;
  ChevronBackIcon: React.ReactNode;
  ShoppingBagIcon: React.ReactNode;
  ChatIcon: React.ReactNode;
  UserIcon: React.ReactNode;
  SearchIcon: React.ReactNode;
  CloseIcon: React.ReactNode;
  Logo: React.ReactNode[];
  VirtualCoinsCrossIcon: React.ReactNode;
  NavigationCrossIcon: React.ReactNode;
  PopupCrossIcon: React.ReactNode;
  PromoCodeCrossIcon: React.ReactNode;
  deliverySettings: {
    deliveryPrice: number;
    paczkomatPrice: number;
  } | null;
  freeShipping: number;
};

export type EmptyCart = {
  image_crochet: ImgType;
  image_knitting: ImgType;
  setShowCart: (variable: boolean) => void;
};

export type Cart = {
  freeShipping: number;
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
  setUsedDiscounts: React.Dispatch<React.SetStateAction<Discount[]>>;
  usedVirtualMoney: number | null;
  usedDiscounts: Discount[];
  userId?: string;
  deliverySettings: {
    deliveryPrice: number;
    paczkomatPrice: number;
  } | null;
  shippingMethods: {
    name: string;
    price: number;
    map: boolean;
  }[];
  currentShippingMethod: string;
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
  courses: NavCourses;
  counts: Counts;
  products: NavProducts;
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
      gallery?: ImgType;
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

export type NavCourses = {
  crocheting: {
    href: string;
    highlighted_courses: {
      name: string;
      slug: { current: string };
      image: ImgType;
    }[];
  };
  knitting: {
    href: string;
    highlighted_courses: {
      name: string;
      slug: { current: string };
      image: ImgType;
    }[];
  };
  additional_links: {
    href: string;
    name: string;
  }[];
};

export type NavProducts = {
  crocheting: {
    href: string;
    highlighted_products: {
      name: string;
      slug: { current: string };
      image: ImgType;
    }[];
  };
  knitting: {
    href: string;
    highlighted_products: {
      name: string;
      slug: { current: string };
      image: ImgType;
    }[];
  };
  additional_links: {
    href: string;
    name: string;
  }[];
};

export type NavListProps = {
  type: 'courses' | 'products';
  columns: {
    name: string;
    href: string;
    showMore?: string | null;
    items: {
      name: string;
      slug: { current: string };
      image: ImgType;
    }[];
  }[];
  additionalLinks: {
    name: string;
    href: string;
  }[];
  name: string;
  handleClose: () => void;
  handleMenu: () => void;
  ChevronBackIcon: ReactNode;
  ChevronDownIcon: ReactNode;
};

type Counts = {
  courses: {
    crocheting: number;
    knitting: number;
  };
  products: {
    crocheting: number;
    knitting: number;
  };
};
