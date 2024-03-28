import type { AffiliateCodeTypes } from '@/components/_dashboard/_AffiliatePage/AffiliateCode';
import type { TextSectionTypes } from '@/components/_dashboard/_AffiliatePage/TextSection';

export type AffiliatePage_QueryTypes = {
  subscribed: {
    hero: {
      heading: string;
    };
    AffiliateCode: AffiliateCodeTypes;
  };
  unsubscribed: {
    hero: TextSectionTypes;
    explainer: TextSectionTypes;
    AffiliateCode: AffiliateCodeTypes;
    simplicity: TextSectionTypes;
    instructions: TextSectionTypes;
  };
};
