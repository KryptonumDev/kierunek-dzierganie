import type { ImgType } from '@/global/types';

export type MascotsQueryTypes = {
  mascots: {
    text: string[];
    image: ImgType[];
  };
};

export type MascotsRenderTypes = MascotsQueryTypes['mascots'] & {
  icon: React.ReactNode;
}