import { ImgType } from '@/global/types';

export type ConversationShowcaseTypes = {
  list: {
    isRecipient: boolean;
    message?: string;
    audioFile?: {
      asset: {
        url: string;
      };
    };
  }[];
  sender: {
    img: ImgType;
    name: string;
  };
  recipient: {
    img: ImgType;
    name: string;
  };
};
