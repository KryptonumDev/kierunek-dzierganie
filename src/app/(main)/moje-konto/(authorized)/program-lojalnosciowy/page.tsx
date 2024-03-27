import sanityFetch from '@/utils/sanity.fetch';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import Balance from '@/components/_dashboard/_AffiliatePage/Balance';
import AffiliateCode, { AffiliateCode_Query } from '@/components/_dashboard/_AffiliatePage/AffiliateCode';
import TextSection, { TextSection_Query } from '@/components/_dashboard/_AffiliatePage/TextSection';
import type { AffiliatePage_QueryTypes } from './page.types';

const currentPath = '/moje-konto/pomoc';

const isSubscribed = false;
const balance = 500;
const name = 'Bogdan';
const affiliateCode = 434344;

export default async function AffiliatePage() {
  const { subscribed, unsubscribed } = await query();

  return (
    <div className='main'>
      {isSubscribed ? (
        <>
          <Balance
            heading={subscribed.hero.heading}
            balance={balance}
            name={name}
          />
          <AffiliateCode
            {...subscribed.AffiliateCode}
            isSubscribed={isSubscribed}
            code={affiliateCode}
          />
        </>
      ) : (
        <>
          <TextSection
            {...unsubscribed.hero}
            isSubscribed={isSubscribed}
          />
          <TextSection
            {...unsubscribed.explainer}
            isSubscribed={isSubscribed}
          />
          <AffiliateCode
            {...subscribed.AffiliateCode}
            isSubscribed={isSubscribed}
            code={affiliateCode}
          />
          <TextSection
            {...unsubscribed.simplicity}
            isSubscribed={isSubscribed}
          />
          <TextSection
            {...unsubscribed.instructions}
            isSubscribed={isSubscribed}
          />
        </>
      )}
    </div>
  );
}

async function query(): Promise<AffiliatePage_QueryTypes> {
  return await sanityFetch<AffiliatePage_QueryTypes>({
    query: /* groq */ `
      *[_type == "AffiliateDashboard_Page"][0] {
        subscribed {
          hero {
            heading,
          },
          AffiliateCode {
            ${AffiliateCode_Query}
          },
        },
        unsubscribed {
          hero {
            ${TextSection_Query}
          },
          explainer {
            ${TextSection_Query}
          },
          AffiliateCode {
            ${AffiliateCode_Query}
          },
          simplicity {
            ${TextSection_Query}
          },
          instructions {
            ${TextSection_Query}
          },
        },
      }
    `,
    tags: ['AffiliateDashboard_Page'],
  });
}

export async function generateMetadata() {
  return await QueryMetadata('AffiliateDashboard_Page', currentPath);
}
