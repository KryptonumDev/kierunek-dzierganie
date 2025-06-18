import { ImgType } from '@/global/types';

export type PartnerSalesTypes = {
  _type: 'partnerSales';
  heading: string;
  paragraph: string;
  imageList: ImgType[];
  salesList: { shopName: string; shopLink?: string; salePercentage: number }[];
};
