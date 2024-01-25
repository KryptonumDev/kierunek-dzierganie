import Image from 'next/image';
import type { ImgType } from '@/global/types';

const defaultPlaceholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP89eVDPQAJLQNfkP/zaAAAAABJRU5ErkJggg==';

type ImgProps = (
  | {
    data: ImgType;
    src?: never;
    width?: never;
    height?: never;
    alt?: never;
  } | {
    data?: never;
    src: string;
    width: number;
    height: number;
    alt: string;
  }
) & {
  priority?: boolean;
} & React.HTMLAttributes<HTMLImageElement | null>;

const Img = ({ data, src, width, height, alt, priority, ...props }: ImgProps) => {
  const placeholder = data?.asset.metadata.lqip || defaultPlaceholder;
  if (data) {
    src = data.asset.url;
    width = data.asset.metadata.dimensions.width;
    height = data.asset.metadata.dimensions.height;
    alt = data.asset.altText;
  }

  return (
    <Image
      src={src!}
      width={width}
      height={height}
      alt={alt || ''}
      priority={priority}
      {...((width! > 40 || height! > 40) && {
        blurDataURL: placeholder,
        placeholder: 'blur',
      })}
      {...props}
    />
  );
};

export default Img;