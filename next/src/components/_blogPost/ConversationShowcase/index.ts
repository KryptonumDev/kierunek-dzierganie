import { Img_Query } from '@/components/ui/image';
import ConversationShowcase from './ConversationShowcase';
export default ConversationShowcase;
export type { ConversationShowcaseTypes } from './ConversationShowcase.types';

export const ConversationShowcase_Query = `
  _type == "ConversationShowcase" => {
    list[] {
      isRecipient,
      message,
      audioFile {
        asset -> {
          url
        }
      },
    },
    sender {
      img {
        ${Img_Query}
      },
      name,
    },
    recipient {
      img {
        ${Img_Query}
      },
      name,
    },
  },
`;
