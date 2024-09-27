import type { Metadata } from 'next';

export type SeoTypes = {
  title: string;
  description?: string;
  path: string;
  img?: string;
  visible: boolean;
} & Metadata;

export type GlobalQueryTypes = {
  og_Img: string;
};
