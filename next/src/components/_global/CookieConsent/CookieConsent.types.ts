export type QueryType = {
  CookieConsent: {
    heading: string | React.ReactNode;
    paragraph: string | React.ReactNode;
    details: {
      heading: string | React.ReactNode;
      paragraph: string | React.ReactNode;
      necessary: {
        service: string;
        cookies: {
          name: string;
          description: string;
          expiry: string;
          type: string;
        }[];
      }[];
      necessary_Description: string;
      preferences: {
        service: string;
        cookies: {
          name: string;
          description: string;
          expiry: string;
          type: string;
        }[];
      }[];
      preferences_Description: string;
      statistical: {
        service: string;
        cookies: {
          name: string;
          description: string;
          expiry: string;
          type: string;
        }[];
      }[];
      statistical_Description: string;
      marketing: {
        service: string;
        cookies: {
          name: string;
          description: string;
          expiry: string;
          type: string;
        }[];
      }[];
      marketing_Description: string;
      unclassified: {
        service: string;
        cookies: {
          name: string;
          description: string;
          expiry: string;
          type: string;
        }[];
      }[];
      unclassified_Description: string;
    };
  };
};

export type ContentProps = {
  CloseIcon: React.ReactNode;
} & QueryType['CookieConsent'];
