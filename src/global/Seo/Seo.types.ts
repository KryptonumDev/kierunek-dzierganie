import type { Metadata } from 'next';

export type SeoTypes = {
  title: string;
  description: string;
  path: string;
  img?: string;
} & Metadata;

export type GlobalQueryTypes = {
  og_Img: string;
};
