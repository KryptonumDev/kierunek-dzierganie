import sanityFetch from '@/utils/sanity.fetch';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import Balance from '@/components/_dashboard/_AffiliatePage/Balance';
import AffiliateCode, { AffiliateCode_Query } from '@/components/_dashboard/_AffiliatePage/AffiliateCode';
import TextSection, { TextSection_Query } from '@/components/_dashboard/_AffiliatePage/TextSection';
import type { AffiliatePage_QueryTypes } from './page.types';
import { createClient } from '@/utils/supabase-server';
import { createClient as createAdminClient } from '@/utils/supabase-admin';
import Breadcrumbs from '@/components/_global/Breadcrumbs';

const currentPath = '/moje-konto/program-lojalnosciowy';
const page = [{ name: 'Program lojalnościowy', path: currentPath }];

export default async function AffiliatePage() {
  const { subscribed, unsubscribed, userId, isSubscribed, name, affiliateCode, balance } = await query();

  return (
    <div className='main'>
      <Breadcrumbs
        visible={false}
        data={page}
      />
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
            userId={userId}
          />
        </>
      ) : (
        <>
          <TextSection
            {...unsubscribed.hero}
            isSubscribed={isSubscribed}
            userId={userId}
          />
          <TextSection
            {...unsubscribed.explainer}
            isSubscribed={isSubscribed}
            userId={userId}
          />
          <AffiliateCode
            {...subscribed.AffiliateCode}
            isSubscribed={isSubscribed}
            code={affiliateCode}
            userId={userId}
          />
          <TextSection
            {...unsubscribed.simplicity}
            isSubscribed={isSubscribed}
            userId={userId}
          />
          <TextSection
            {...unsubscribed.instructions}
            isSubscribed={isSubscribed}
            userId={userId}
          />
        </>
      )}
    </div>
  );
}

export async function generateMetadata() {
  return await QueryMetadata('AffiliateDashboard_Page', currentPath);
}

async function query(): Promise<AffiliatePage_QueryTypes> {
  const supabase = createClient();
  const adminbase = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await adminbase
    .from('profiles')
    .select(
      `
      id,
      left_handed,
      billing_data->firstName,
      coupons (
        code
      ),
      virtual_wallet (
        amount
      )
    `
    )
    .eq('id', user!.id)
    .single();

  const res = await sanityFetch<AffiliatePage_QueryTypes>({
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

  return {
    ...res,
    userId: user!.id,
    // @ts-expect-error - coupons is not array, bug in supabase
    isSubscribed: data!.coupons?.code,
    name: data!.firstName as string,
    // @ts-expect-error - coupons is not array, bug in supabase
    affiliateCode: data!.coupons?.code,
    // @ts-expect-error - virtual_wallet is not array, bug in supabase
    balance: data!.virtual_wallet?.amount,
  }
}