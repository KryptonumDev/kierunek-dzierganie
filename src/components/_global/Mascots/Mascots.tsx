import sanityFetch from '@/utils/sanity.fetch';
import { Img_Query } from '@/components/ui/image';
import MascotsRender from './MascotsRender';
import type { MascotsQueryTypes } from './Mascots.types';

export default async function Mascots() {
  const { text, image } = await query();

  return (
    <MascotsRender
      text={text}
      image={image}
      icon={MessageIcon}
    />
  );
}

const query = async (): Promise<MascotsQueryTypes['mascots']> => {
  const data = await sanityFetch<MascotsQueryTypes>({
    query: /* groq */ `
      *[_type == "global"][0]{
        mascots {
          text[],
          image[] {
            ${Img_Query}
          },
        }
      }
    `,
    tags: ['global'],
  });

  return data?.mascots;
};

const MessageIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={33}
    height={25}
    viewBox='0 0 33 25'
    fill='none'
  >
    <path
      d='M28.743 22.396c-.938-5.24 1.257-11.43 3.77-15.854 1.007-1.775-.688-5.606-2.726-5.6l-26.779.083C1.216 1.03.27 3.163 1.521 4.39 11.876 14.548 21.103 21.987 26.532 24.61c1.38.666 2.48-.713 2.21-2.214Z'
      fill='#EFE8E7'
    />
  </svg>
);