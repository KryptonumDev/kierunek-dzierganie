import type { File } from '@/global/types';

export type PartnershipProgramPage_QueryTypes = {
  global: {
    tel?: string;
    email?: string;
  };
  page: {
    header_Heading: string;
    header_Description: string;
    content: {
      title: string;
      description: string;
    }[];
    files: File[];
  };
};
