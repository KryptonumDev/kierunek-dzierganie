import type { ImgType } from '@/global/types';
import type { VideoProvider } from '../VideoPlayer/VideoPlayer.types';

export type GalleryTypes = {
  images: Array<{
    data: ImgType | string;
    type: 'video' | 'image';
    videoProvider?: VideoProvider;
  }>;
};
