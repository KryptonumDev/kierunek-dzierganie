import type { Billing, Discount, ImgType, Product, ProductCard, Shipping } from '@/global/types';
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
    highlighted_products: Array<ProductCard>;
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
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
};
