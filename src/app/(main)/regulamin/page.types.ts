export type StatutePage_QueryTypes = {
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
    files: {
      asset: {
        url: string;
        originalFilename: string;
        size: number;
      };
    }[];
  };
};
