import { Img_Query } from '@/components/ui/image';
import type { ImgType } from '@/global/types';
import { generateRandomCode } from '@/utils/generate-random-code';
import sanityFetch from '@/utils/sanity.fetch';
import { createClient } from '@/utils/supabase-admin';

export type OfferedItem = {
  _id: string;
  _type: 'course' | 'bundle';
  name: string;
  price: number;
  discount?: number;
  slug: string;
  basis: string;
  image: ImgType | null;
};

export type PostPurchaseOfferPayload = {
  heading: string;
  paragraph: string | null;
  discountAmount: number;
  expirationDate: string | null;
  couponCode: string;
  offeredItems: OfferedItem[];
};

export type ResolvePostPurchaseOfferResult =
  | { type: 'offer'; offer: PostPurchaseOfferPayload }
  | { type: 'no-offer' }
  | { type: 'not-found' }
  | { type: 'forbidden' };

type SanityProductWithOffer = {
  _id: string;
  _type: string;
  postPurchaseOffer?: {
    enabled: boolean;
    heading: string;
    paragraph?: string;
    discountAmount: number;
    discountTimeMinutes?: number | null;
    offeredItems: OfferedItem[];
  };
};

type OrderProduct = {
  id: string;
  type: string;
};

/**
 * Lightweight check: returns true if any of the given product items has postPurchaseOffer.enabled.
 * Used by the payment redirect routes to decide whether to send the user to /dziekujemy/[orderId].
 * Does not create a coupon — that happens lazily when the user lands on the page.
 */
export async function hasPostPurchaseOffer(
  productItems: Array<{ id: string; type: string }>
): Promise<boolean> {
  const courseAndBundleIds = productItems
    .filter((p) => p.type === 'course' || p.type === 'bundle')
    .map((p) => p.id);

  if (courseAndBundleIds.length === 0) return false;

  const results = await sanityFetch<Array<{ postPurchaseOfferEnabled: boolean | null }>>({
    query: /* groq */ `
      *[(_type == "course" || _type == "bundle") && _id in $ids] {
        "postPurchaseOfferEnabled": postPurchaseOffer.enabled
      }
    `,
    params: { ids: courseAndBundleIds },
    noCache: true,
  });

  return results?.some((r) => r.postPurchaseOfferEnabled === true) ?? false;
}

/**
 * Resolves the post-purchase offer for a given order and user.
 * Handles Sanity config lookup, coupon creation (idempotent), and returns the full offer payload.
 * Used by both the /dziekujemy/[orderId] page and the /api/post-purchase-offer/[orderId] route.
 */
export async function resolvePostPurchaseOffer(
  orderId: string,
  userId: string
): Promise<ResolvePostPurchaseOfferResult> {
  const supabase = createClient();

  // Fetch the order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, user_id, paid_at, products, is_guest_order')
    .eq('id', orderId)
    .single();

  if (orderError || !order) {
    return { type: 'not-found' };
  }

  // Validate ownership and not a guest order
  if (order.is_guest_order || order.user_id !== userId) {
    return { type: 'forbidden' };
  }

  // Extract course and bundle IDs — only these types can have a postPurchaseOffer
  const productItems: OrderProduct[] = order.products?.array ?? [];
  const courseAndBundleIds = productItems
    .filter((p) => p.type === 'course' || p.type === 'bundle')
    .map((p) => p.id);

  if (courseAndBundleIds.length === 0) {
    return { type: 'no-offer' };
  }

  // Query Sanity for postPurchaseOffer config on the purchased products
  const sanityProducts = await sanityFetch<SanityProductWithOffer[]>({
    query: /* groq */ `
      *[(_type == "course" || _type == "bundle") && _id in $ids] {
        _id,
        _type,
        postPurchaseOffer {
          enabled,
          heading,
          paragraph,
          discountAmount,
          discountTimeMinutes,
          "offeredItems": offeredItems[] -> {
            _id,
            _type,
            name,
            price,
            discount,
            basis,
            "slug": slug.current,
            "image": gallery[0] {
              ${Img_Query}
            },
          },
        }
      }
    `,
    params: { ids: courseAndBundleIds },
    noCache: true,
  });

  // Find the first purchased product with an active offer
  const productWithOffer = sanityProducts?.find((p) => p.postPurchaseOffer?.enabled === true);

  if (!productWithOffer?.postPurchaseOffer) {
    return { type: 'no-offer' };
  }

  const offerConfig = productWithOffer.postPurchaseOffer;

  if (!offerConfig.offeredItems || offerConfig.offeredItems.length === 0) {
    return { type: 'no-offer' };
  }

  // Idempotency check — return the existing coupon if one was already created for this order
  const { data: existingCoupon } = await supabase
    .from('coupons')
    .select('code, expiration_date, amount')
    .contains('course_discount_data', { order_id: orderId })
    .maybeSingle();

  let couponCode: string;
  let expirationDate: string | null;

  if (existingCoupon) {
    couponCode = existingCoupon.code;
    expirationDate = existingCoupon.expiration_date ?? null;
  } else {
    // Expiration anchored to paid_at so timer survives page refreshes.
    // If discountTimeMinutes is not set, the coupon has no expiry (infinite offer).
    let expiry: string | null = null;
    if (offerConfig.discountTimeMinutes) {
      const paidAt = order.paid_at ? new Date(order.paid_at) : new Date();
      expiry = new Date(paidAt.getTime() + offerConfig.discountTimeMinutes * 60_000).toISOString();
    }

    const discountedProducts = offerConfig.offeredItems.map((item) => ({
      id: item._id,
      name: item.name,
    }));

    const { data: newCoupon, error: couponError } = await supabase
      .from('coupons')
      .insert({
        description: 'Post-purchase offer',
        type: 3, // FIXED PRODUCT
        code: generateRandomCode(),
        state: 2, // active
        amount: offerConfig.discountAmount,
        use_limit: 1,
        expiration_date: expiry,
        discounted_product: discountedProducts[0] ?? null,
        discounted_products: discountedProducts,
        course_discount_data: {
          order_id: orderId,
          user_id: userId,
        },
      })
      .select('code, expiration_date')
      .single();

    if (couponError || !newCoupon) {
      console.error('❌ Failed to create post-purchase coupon for order', orderId, couponError?.message);
      return { type: 'no-offer' };
    }

    couponCode = newCoupon.code;
    expirationDate = newCoupon.expiration_date ?? null;
  }

  return {
    type: 'offer',
    offer: {
      heading: offerConfig.heading,
      paragraph: offerConfig.paragraph ?? null,
      discountAmount: offerConfig.discountAmount,
      expirationDate,
      couponCode,
      offeredItems: offerConfig.offeredItems,
    },
  };
}
