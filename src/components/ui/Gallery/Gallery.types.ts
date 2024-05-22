import type { ImgType } from '@/global/types';

export type GalleryTypes = {
  images: {
    data: ImgType | string;
    type: 'image' | 'video';
  }[];
};
