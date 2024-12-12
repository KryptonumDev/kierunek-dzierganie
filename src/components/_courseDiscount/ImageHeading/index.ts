import ImageHeading from './ImageHeading';
export default ImageHeading;
export type { ImageHeadingTypes } from './ImageHeading.types';

export const ImageHeading_Query = `
  imageHeading {
  image,
  heading,
  paragraph,
}
`;
