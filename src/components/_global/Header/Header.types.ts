import { ImgType } from '@/global/types';

export type QueryProps = {
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