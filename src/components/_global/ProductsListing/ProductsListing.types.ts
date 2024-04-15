import type { ProductCard } from '@/global/types';

export type ProductsListingTypes = {
  products: ProductCard[];
  title: JSX.Element;
  text: JSX.Element;
  basis: string;
  courses: boolean;
  categories: {
    name: string;
    slug: string;
    _id: string;
  }[];
};

export type FiltersTypes = {
  basis: string;
  courses: boolean;
  categories: {
    name: string;
    slug: string;
    _id: string;
  }[];
}