import type { ProductCard } from '@/global/types';

export type ProductsListingTypes = {
  products: ProductCard[];
  title: JSX.Element;
  text: JSX.Element;
  basis: string;
  courses: boolean;
  productsTotalCount: number;
  categories: {
    name: string;
    slug: string;
    _id: string;
  }[];
  authors: {
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
  authors?: {
    name: string;
    slug: string;
    _id: string;
  }[];
};

export type PaginationTypes = {
  allElementsCount: number;
  elementsPerPage: number;
  basis: string;
};
