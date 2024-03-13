import type { ImgType, Product, ProductCard } from '@/global/types';
import type { Item } from 'react-use-cart';

export type useCartItems = {
  cart: Item[] | null;
  fetchedItems: Array<Product> | null;
  updateItemQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
};

export type QueryProps = {
  markdownNavAnnotation: JSX.Element;
  global: {
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
  cart: Cart;
  ChevronDownIcon: React.ReactNode;
  ChevronBackIcon: React.ReactNode;
  SearchIcon: React.ReactNode;
  CloseIcon: React.ReactNode;
  Logo: React.ReactNode;
  CrossIcon: React.ReactNode;
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
} & useCartItems;

export type Grid = {
  updateItemQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  cart: Item[] | null;
  fetchedItems: Product[] | null;
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
};
