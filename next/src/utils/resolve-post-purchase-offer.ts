import { Img_Query } from '@/components/ui/image';
import type { ImgType } from '@/global/types';
import { generateRandomCode } from '@/utils/generate-random-code';
import sanityFetch from '@/utils/sanity.fetch';
import { createClient } from '@/utils/supabase-admin';

export type OfferedItem = {
  _id: string;
  _type: 'course' | 'bundle' | 'product';
  name: string;
  price: number | null;
  discount?: number;
  slug: string;
  basis: string;
  image: ImgType | null;
  variants?: Array<{
    price: number;
    discount?: number;
    image: ImgType | null;
  }> | null;
};

export type PostPurchaseOfferMode = 'discounted' | 'standard';
export type PostPurchaseOfferSection =
  | PostPurchaseProductSectionPayload
  | PostPurchaseNewsletterSectionPayload;

export type PostPurchaseProductSectionPayload = {
  _type: 'productOffer';
  heading: string | null;
  paragraph: string | null;
  offerMode: PostPurchaseOfferMode;
  discountAmount: number | null;
  expirationDate: string | null;
  couponCode: string | null;
  offeredItems: OfferedItem[];
};

export type PostPurchaseNewsletterSectionPayload = {
  _type: 'newsletterSignup';
  heading: string | null;
  paragraph: string | null;
  groupId: string | null;
  buttonLabel: string | null;
  successMessage: string | null;
  errorMessage: string | null;
  image: ImgType | null;
};

export type PostPurchaseOfferPayload = {
  sections: PostPurchaseOfferSection[];
};

export type ResolvePostPurchaseOfferResult =
  | { type: 'offer'; offer: PostPurchaseOfferPayload }
  | { type: 'no-offer' }
  | { type: 'not-found' }
  | { type: 'forbidden' };

type SanityProductWithOffer = {
  _id: string;
  _type: string;
  postPurchaseOffer?: PostPurchaseOfferConfig;
};

type OrderProduct = {
  id: string;
  type: string;
};

type PostPurchaseOfferLayout = 'product-only' | 'product-plus-newsletter';

type LegacyNewsletterConfig = {
  heading?: string;
  paragraph?: string;
  groupId?: string;
  buttonLabel?: string;
  successMessage?: string;
  errorMessage?: string;
};

type PostPurchaseProductSectionConfig = {
  _type: 'postPurchaseProductOfferSection';
  heading?: string;
  paragraph?: string;
  offeredItems?: OfferedItem[];
  offerMode?: PostPurchaseOfferMode;
  discountAmount?: number | null;
  discountTimeMinutes?: number | null;
};

type PostPurchaseNewsletterSectionConfig = {
  _type: 'postPurchaseNewsletterSignupSection';
  heading?: string;
  paragraph?: string;
  groupId?: string;
  buttonLabel?: string;
  successMessage?: string;
  errorMessage?: string;
  image?: ImgType | null;
};

type PostPurchaseSectionConfig =
  | PostPurchaseProductSectionConfig
  | PostPurchaseNewsletterSectionConfig;

type PostPurchaseOfferConfig = {
  enabled: boolean;
  sections?: PostPurchaseSectionConfig[];
  heading?: string;
  paragraph?: string;
  layout?: PostPurchaseOfferLayout;
  newsletter?: LegacyNewsletterConfig;
  offerMode?: PostPurchaseOfferMode;
  discountAmount?: number | null;
  discountTimeMinutes?: number | null;
  offeredItems?: OfferedItem[];
};

type PreviewableOfferDocument = {
  _id: string;
  _type: 'course' | 'bundle';
  postPurchaseOffer?: PostPurchaseOfferConfig;
};

type DiscountSectionCoupon = {
  code: string;
  amount: number;
  expirationDate: string | null;
};

const OFFERED_ITEMS_QUERY = `
  _id,
  _type,
  name,
  price,
  discount,
  basis,
  "slug": slug.current,
  "image": select(
    defined(gallery[0]) => gallery[0] {
      ${Img_Query}
    },
    defined(variants[0].gallery[0]) => variants[0].gallery[0] {
      ${Img_Query}
    },
    null
  ),
  "variants": variants[]{
    price,
    discount,
    "image": gallery[0] {
      ${Img_Query}
    }
  }
`;

const POST_PURCHASE_OFFER_QUERY = `
  postPurchaseOffer {
    enabled,
    sections[]{
      _type,
      heading,
      paragraph,
      groupId,
      buttonLabel,
      successMessage,
      errorMessage,
      image {
        ${Img_Query}
      },
      offerMode,
      discountAmount,
      discountTimeMinutes,
      "offeredItems": offeredItems[] -> {
        ${OFFERED_ITEMS_QUERY}
      }
    },
    heading,
    paragraph,
    layout,
    newsletter {
      heading,
      paragraph,
      groupId,
    },
    offerMode,
    discountAmount,
    discountTimeMinutes,
    "offeredItems": offeredItems[] -> {
      ${OFFERED_ITEMS_QUERY}
    }
  }
`;

const resolveOfferLayout = (layout?: PostPurchaseOfferLayout): PostPurchaseOfferLayout =>
  layout === 'product-plus-newsletter' ? 'product-plus-newsletter' : 'product-only';

const resolveOptionalText = (value?: string | null): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const normalizeLegacySections = (offerConfig: PostPurchaseOfferConfig): PostPurchaseSectionConfig[] => {
  const sections: PostPurchaseSectionConfig[] = [];
  const legacyHeading = resolveOptionalText(offerConfig.heading) ?? undefined;
  const legacyParagraph = resolveOptionalText(offerConfig.paragraph) ?? undefined;

  if (offerConfig.offeredItems?.length) {
    sections.push({
      _type: 'postPurchaseProductOfferSection',
      heading: legacyHeading,
      paragraph: legacyParagraph,
      offeredItems: offerConfig.offeredItems,
      offerMode: offerConfig.offerMode,
      discountAmount: offerConfig.discountAmount,
      discountTimeMinutes: offerConfig.discountTimeMinutes,
    });
  }

  if (resolveOfferLayout(offerConfig.layout) === 'product-plus-newsletter') {
    const newsletterHeading = resolveOptionalText(offerConfig.newsletter?.heading);
    const newsletterParagraph = resolveOptionalText(offerConfig.newsletter?.paragraph);

    if (newsletterHeading || newsletterParagraph) {
      sections.push({
        _type: 'postPurchaseNewsletterSignupSection',
        heading: newsletterHeading ?? undefined,
        paragraph: newsletterParagraph ?? undefined,
        groupId: offerConfig.newsletter?.groupId,
        buttonLabel: offerConfig.newsletter?.buttonLabel,
        successMessage: offerConfig.newsletter?.successMessage,
        errorMessage: offerConfig.newsletter?.errorMessage,
      });
    }
  }

  return sections;
};

const getConfiguredSections = (offerConfig?: PostPurchaseOfferConfig | null): PostPurchaseSectionConfig[] => {
  if (!offerConfig) return [];
  if (Array.isArray(offerConfig.sections) && offerConfig.sections.length) return offerConfig.sections;
  return normalizeLegacySections(offerConfig);
};

const isProductSection = (
  section: PostPurchaseSectionConfig
): section is PostPurchaseProductSectionConfig => section._type === 'postPurchaseProductOfferSection';

const isNewsletterSection = (
  section: PostPurchaseSectionConfig
): section is PostPurchaseNewsletterSectionConfig => section._type === 'postPurchaseNewsletterSignupSection';

const resolveSectionOfferMode = (offerMode?: PostPurchaseOfferMode): PostPurchaseOfferMode =>
  offerMode === 'standard' ? 'standard' : 'discounted';

const hasDiscountedProductSections = (
  sections: PostPurchaseSectionConfig[]
): PostPurchaseProductSectionConfig[] =>
  sections.filter(
    (section): section is PostPurchaseProductSectionConfig =>
      isProductSection(section) &&
      Array.isArray(section.offeredItems) &&
      section.offeredItems.length > 0 &&
      resolveSectionOfferMode(section.offerMode) === 'discounted'
  );

const hasRenderableSection = (section: PostPurchaseSectionConfig) => {
  if (isProductSection(section)) return Boolean(section.offeredItems?.length);
  if (isNewsletterSection(section)) return true;
  return false;
};

const hasValidOfferConfig = (offerConfig?: PostPurchaseOfferConfig | null) => {
  if (!offerConfig?.enabled) return false;

  const sections = getConfiguredSections(offerConfig).filter(hasRenderableSection);
  if (!sections.length) return false;

  return hasDiscountedProductSections(sections).length <= 1;
};

const createProductSectionPayload = ({
  section,
  offerMode,
  discountCoupon,
}: {
  section: PostPurchaseProductSectionConfig;
  offerMode: PostPurchaseOfferMode;
  discountCoupon?: DiscountSectionCoupon | null;
}): PostPurchaseProductSectionPayload => ({
  _type: 'productOffer',
  heading: resolveOptionalText(section.heading),
  paragraph: resolveOptionalText(section.paragraph),
  offerMode,
  discountAmount: discountCoupon?.amount ?? null,
  expirationDate: discountCoupon?.expirationDate ?? null,
  couponCode: discountCoupon?.code ?? null,
  offeredItems: section.offeredItems ?? [],
});

const createNewsletterSectionPayload = (
  section: PostPurchaseNewsletterSectionConfig
): PostPurchaseNewsletterSectionPayload | null => {
  const heading = resolveOptionalText(section.heading);
  const paragraph = resolveOptionalText(section.paragraph);

  if (!heading && !paragraph) return null;

  return {
    _type: 'newsletterSignup',
    heading,
    paragraph,
    groupId: resolveOptionalText(section.groupId),
    buttonLabel: resolveOptionalText(section.buttonLabel),
    successMessage: resolveOptionalText(section.successMessage),
    errorMessage: resolveOptionalText(section.errorMessage),
    image: section.image ?? null,
  };
};

const getDiscountExpirationDate = (discountTimeMinutes: number | null | undefined, baseDate: Date) => {
  if (!discountTimeMinutes) return null;
  return new Date(baseDate.getTime() + discountTimeMinutes * 60_000).toISOString();
};

const resolveDiscountCouponForOrder = async ({
  supabase,
  orderId,
  userId,
  paidAt,
  section,
}: {
  supabase: ReturnType<typeof createClient>;
  orderId: string;
  userId: string;
  paidAt: string | null;
  section: PostPurchaseProductSectionConfig;
}): Promise<DiscountSectionCoupon | null> => {
  const expirationDate = getDiscountExpirationDate(section.discountTimeMinutes, paidAt ? new Date(paidAt) : new Date());

  const { data: existingCoupon } = await supabase
    .from('coupons')
    .select('code, expiration_date, amount')
    .contains('course_discount_data', { order_id: orderId })
    .maybeSingle();

  const existingCouponAmount =
    typeof existingCoupon?.amount === 'number' && existingCoupon.amount > 0 ? existingCoupon.amount : null;

  if (existingCoupon?.code && existingCouponAmount) {
    return {
      code: existingCoupon.code,
      amount: existingCouponAmount,
      expirationDate: existingCoupon.expiration_date ?? expirationDate,
    };
  }

  if (typeof section.discountAmount !== 'number' || section.discountAmount <= 0) {
    console.error('❌ Invalid post-purchase discount configuration for order', orderId);
    return null;
  }

  const discountedProducts = (section.offeredItems ?? []).map((item) => ({
    id: item._id,
    name: item.name,
  }));

  const { data: newCoupon, error: couponError } = await supabase
    .from('coupons')
    .insert({
      description: 'Post-purchase offer',
      type: 3,
      code: generateRandomCode(),
      state: 2,
      amount: section.discountAmount,
      use_limit: 1,
      expiration_date: expirationDate,
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
    return null;
  }

  return {
    code: newCoupon.code,
    amount: section.discountAmount,
    expirationDate: newCoupon.expiration_date ?? expirationDate,
  };
};

const resolvePreviewDiscountCoupon = (section: PostPurchaseProductSectionConfig): DiscountSectionCoupon | null => {
  if (typeof section.discountAmount !== 'number' || section.discountAmount <= 0) {
    return null;
  }

  return {
    code: 'PODGLAD-RABAT',
    amount: section.discountAmount,
    expirationDate: getDiscountExpirationDate(section.discountTimeMinutes, new Date()),
  };
};

const buildResolvedSections = ({
  sections,
  discountCoupon,
}: {
  sections: PostPurchaseSectionConfig[];
  discountCoupon?: DiscountSectionCoupon | null;
}): PostPurchaseOfferSection[] => {
  return sections.reduce<PostPurchaseOfferSection[]>((acc, section) => {
    if (isNewsletterSection(section)) {
      const newsletterSection = createNewsletterSectionPayload(section);
      if (newsletterSection) acc.push(newsletterSection);
      return acc;
    }

    if (!isProductSection(section) || !section.offeredItems?.length) {
      return acc;
    }

    const offerMode = resolveSectionOfferMode(section.offerMode);

    if (offerMode === 'discounted' && !discountCoupon) {
      return acc;
    }

    acc.push(
      createProductSectionPayload({
        section,
        offerMode,
        discountCoupon: offerMode === 'discounted' ? discountCoupon : null,
      })
    );

    return acc;
  }, []);
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

  const results = await sanityFetch<SanityProductWithOffer[]>({
    query: /* groq */ `
      *[(_type == "course" || _type == "bundle") && _id in $ids] {
        _id,
        _type,
        ${POST_PURCHASE_OFFER_QUERY}
      }
    `,
    params: { ids: courseAndBundleIds },
    noCache: true,
  });

  return results?.some((result) => hasValidOfferConfig(result.postPurchaseOffer)) ?? false;
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
        ${POST_PURCHASE_OFFER_QUERY}
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
  const configuredSections = getConfiguredSections(offerConfig).filter(hasRenderableSection);

  if (!configuredSections.length) {
    return { type: 'no-offer' };
  }

  const discountedSections = hasDiscountedProductSections(configuredSections);
  if (discountedSections.length > 1) {
    console.error('❌ More than one discounted post-purchase section configured', orderId);
    return { type: 'no-offer' };
  }

  const discountedSection = discountedSections[0];

  const discountCoupon =
    discountedSections.length === 1 && discountedSection
      ? await resolveDiscountCouponForOrder({
          supabase,
          orderId,
          userId,
          paidAt: order.paid_at ?? null,
          section: discountedSection,
        })
      : null;

  const resolvedSections = buildResolvedSections({
    sections: configuredSections,
    discountCoupon,
  });

  if (!resolvedSections.length) {
    return { type: 'no-offer' };
  }

  return {
    type: 'offer',
    offer: {
      sections: resolvedSections,
    },
  };
}

export async function resolvePostPurchaseOfferPreview(
  documentId: string,
  documentType: 'course' | 'bundle'
): Promise<Exclude<ResolvePostPurchaseOfferResult, { type: 'forbidden' }>> {
  const normalizedDocumentId = documentId.replace('drafts.', '');

  const previewDocument = await sanityFetch<PreviewableOfferDocument | null>({
    query: /* groq */ `
      *[
        _type == $documentType &&
        (_id == $documentId || _id == "drafts." + $documentId)
      ][0]{
        _id,
        _type,
        ${POST_PURCHASE_OFFER_QUERY}
      }
    `,
    params: {
      documentId: normalizedDocumentId,
      documentType,
    },
    useAuthClient: true,
    noCache: true,
  });

  if (!previewDocument) {
    return { type: 'not-found' };
  }

  const offerConfig = previewDocument.postPurchaseOffer;
  const configuredSections = getConfiguredSections(offerConfig).filter(hasRenderableSection);

  if (!offerConfig?.enabled || !configuredSections.length) {
    return { type: 'no-offer' };
  }

  const discountedSections = hasDiscountedProductSections(configuredSections);
  if (discountedSections.length > 1) {
    return { type: 'no-offer' };
  }

  const discountedSection = discountedSections[0];
  const discountCoupon =
    discountedSections.length === 1 && discountedSection ? resolvePreviewDiscountCoupon(discountedSection) : null;

  const resolvedSections = buildResolvedSections({
    sections: configuredSections,
    discountCoupon,
  });

  if (!resolvedSections.length) {
    return { type: 'no-offer' };
  }

  return {
    type: 'offer',
    offer: {
      sections: resolvedSections,
    },
  };
}
