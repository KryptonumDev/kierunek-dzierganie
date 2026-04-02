import type { InputState } from '@/components/_global/Header/Checkout/Checkout.types';
import { hasPostPurchaseOffer } from '@/utils/resolve-post-purchase-offer';
import { getActiveOwnedCourseIds } from '@/utils/course-access';
import { createClient } from '@/utils/supabase-admin';
import { siteUrl } from '@/utils/site-url';
import { getTodayInWarsawDateString, isFixedDateCourseExpired } from '@/utils/storefront-course-availability';
import sanityFetch from '@/utils/sanity.fetch';
import { Country, Currency, Encoding, Language, P24 } from '@ingameltd/node-przelewy24';
import { NextResponse } from 'next/server';
import { checkUsedModifications } from '../complete/check-used-modifications';
import { sendEmails } from '../complete/send-emails';
import { updateItemsQuantity } from '../complete/update-items-quantity';
import { generateGuestOrderToken, isGuestOrder } from '@/utils/generate-guest-order-token';
import { createVoucherCoupons } from '../complete/create-voucher-coupons';
import { type CategoryRestrictions, calculateEligibleSubtotal } from '@/utils/coupon-eligibility';
import {
  resolveProductCardsShippingInfo,
  shippingModeChargesDelivery,
  shippingModeRequiresDelivery,
} from '@/utils/resolve-shipping-mode';
import { resolveProductCardShipmentDeclaredValue } from '@/utils/resolve-shipment-declared-value';
// import { pdf } from '@react-pdf/renderer';

export const dynamic = 'force-dynamic';

// Polish postal code regex: XX-XXX (two digits, hyphen, three digits)
const POLISH_POSTAL_CODE_REGEX = /^\d{2}-\d{3}$/;

export async function POST(request: Request) {
  const { input, description }: { input: InputState; description: string } = await request.json();
  const supabase = createClient();

  console.log('payment/create:input');
  console.log(input);

  // Server-side postal code validation
  const billingPostcode = input.billing?.postcode;
  const shippingPostcode = input.shipping?.postcode;

  if (!billingPostcode || !POLISH_POSTAL_CODE_REGEX.test(billingPostcode)) {
    console.error('Invalid billing postal code:', billingPostcode);
    return NextResponse.json(
      { error: 'Niepoprawny kod pocztowy do faktury (wymagany format: XX-XXX, np. 00-001)' },
      { status: 400 }
    );
  }

  // Validate shipping postal code only if the customer entered a separate shipping address.
  if (!input.shippingSameAsBilling && shippingPostcode) {
    if (!POLISH_POSTAL_CODE_REGEX.test(shippingPostcode)) {
      console.error('Invalid shipping postal code:', shippingPostcode);
      return NextResponse.json(
        { error: 'Niepoprawny kod pocztowy dostawy (wymagany format: XX-XXX, np. 00-001)' },
        { status: 400 }
      );
    }
  }

  // update user default data for next orders (skip for guest orders)
  if (input.user_id && !input.isGuestCheckout) {
    await supabase
      .from('profiles')
      .update({ billing_data: input.billing, shipping_data: input.shipping })
      .eq('id', input.user_id);
  }

  try {
    const p24 = new P24(
      Number(process.env.P24_MERCHANT_ID!),
      Number(process.env.P24_POS_ID!),
      process.env.P24_REST_API_KEY!,
      process.env.P24_CRC!,
      {
        sandbox: process.env.SANDBOX === 'true',
      }
    );

    // Log P24 environment (server-side only)
    if (typeof window === 'undefined') {
      console.log(`💳 P24 Mode: ${process.env.SANDBOX === 'true' ? 'SANDBOX (Test)' : 'PRODUCTION (Real)'}`);
    }
    const { data: settingsData } = await supabase.from('settings').select('value').eq('name', 'ifirma').single();
    const { data: deliverySettings } = await supabase
      .from('settings')
      .select('value->deliveryPrice, value->paczkomatPrice')
      .eq('name', 'apaczka')
      .returns<{ deliveryPrice: number; paczkomatPrice: number }[]>()
      .single();
    const { data: freeShippingData } = await supabase
      .from('settings')
      .select('value->freeDeliveryAmount')
      .eq('name', 'general')
      .single();

    // Ensure we always have an array to map over
    const productItems = input.products?.array ?? [];

    // Guard: Prevent creating orders with empty product arrays
    if (productItems.length === 0) {
      console.error('🚫 Payment creation blocked: Empty products array', {
        user_id: input.user_id,
        guest_email: input.billing?.email,
        amount: input.totalAmount,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json({ error: 'Cannot create order with empty products array' }, { status: 400 });
    }

    const shippingSourceItems = await sanityFetch<
      Array<{
        _id: string;
        _type: 'product' | 'course' | 'bundle' | 'voucher';
        price?: number | null;
        discount?: number | null;
        shippingMode?: 'none' | 'included' | 'paid' | null;
        shippingLabel?: string | null;
        shipmentDeclaredValue?: number | null;
        courses?: Array<{
          _id: string;
          price?: number | null;
          discount?: number | null;
          shippingMode?: 'none' | 'included' | 'paid' | null;
          shippingLabel?: string | null;
          shipmentDeclaredValue?: number | null;
        }> | null;
      }>
    >({
      query:
        '*[(_type == "product" || _type == "course" || _type == "bundle" || _type == "voucher") && _id in $ids]{_id, _type, price, discount, shippingMode, shippingLabel, shipmentDeclaredValue, "courses": courses[]->{_id, price, discount, shippingMode, shippingLabel, shipmentDeclaredValue}}',
      params: { ids: Array.from(new Set(productItems.map((item) => item.id))) },
      noCache: true,
    });

    const shippingSourceMap = new Map(shippingSourceItems.map((item) => [item._id, item]));
    const serverResolvedShippingItems = productItems.map((product) => {
      const sourceItem = shippingSourceMap.get(product.id);

      if (!sourceItem) {
        throw new Error(`Missing shipping source item for ${product.id}`);
      }

      return {
        ...sourceItem,
        voucherData: product.voucherData,
      };
    });
    const serverResolvedShipmentDeclaredValues = productItems.map((product) => {
      const sourceItem = shippingSourceMap.get(product.id);

      if (!sourceItem) {
        throw new Error(`Missing shipment declared value source item for ${product.id}`);
      }

      const declaredValueContext = {
        ...sourceItem,
        price:
          sourceItem._type === 'course'
            ? sourceItem.price ?? product.price
            : product.price,
        discount:
          sourceItem._type === 'course'
            ? sourceItem.discount ?? (typeof product.discount === 'number' ? product.discount : undefined)
            : typeof product.discount === 'number'
              ? product.discount
              : undefined,
        quantity: product.quantity ?? 1,
        voucherData: product.voucherData,
      };

      return resolveProductCardShipmentDeclaredValue(declaredValueContext);
    });

    const resolvedOrderShippingInfo = resolveProductCardsShippingInfo(serverResolvedShippingItems);
    const serverNeedDelivery = shippingModeRequiresDelivery(resolvedOrderShippingInfo.mode);
    const serverChargesDelivery = shippingModeChargesDelivery(resolvedOrderShippingInfo.mode);
    const configuredShippingMethods = [
      {
        name: 'Kurier InPost',
        price: deliverySettings?.deliveryPrice ?? 2000,
        map: false,
      },
      {
        name: 'Paczkomat Inpost',
        price: deliverySettings?.paczkomatPrice ?? 2000,
        map: true,
      },
    ];
    const selectedShippingMethod = input.shippingMethod?.name
      ? configuredShippingMethods.find((method) => method.name === input.shippingMethod?.name)
      : null;

    if (serverNeedDelivery && !selectedShippingMethod) {
      return NextResponse.json({ error: 'Wybierz sposób dostawy' }, { status: 400 });
    }

    if (selectedShippingMethod?.map && !input.shippingMethod?.data) {
      return NextResponse.json({ error: 'Musisz wybrać paczkomat' }, { status: 400 });
    }

    // Server-side guard: block products whose parent course references them as materials/manuals
    const productIdsNeedingRelation = Array.from(
      new Set(productItems.filter((item) => item.type === 'product').map((item) => item.id))
    );

    console.log('productIdsNeedingRelation', productIdsNeedingRelation);
    console.log('productItems', productItems);

    const orderCourseIds = new Set<string>();
    productItems.forEach((item) => {
      if (item.type === 'course') {
        orderCourseIds.add(item.id);
      }
      const linkedCourses = item.courses;
      if (Array.isArray(linkedCourses)) {
        linkedCourses.forEach((course) => {
          if (course?._id) {
            orderCourseIds.add(course._id);
          }
        });
      }
    });

    const todayWarsaw = getTodayInWarsawDateString();
    if (orderCourseIds.size > 0) {
      const orderCourses = await sanityFetch<
        Array<{
          _id: string;
          name?: string;
          accessMode?: 'unlimited' | 'duration_months' | 'fixed_date' | null;
          accessFixedDate?: string | null;
        }>
      >({
        query: '*[_type == "course" && _id in $courseIds]{_id, name, accessMode, accessFixedDate}',
        params: { courseIds: Array.from(orderCourseIds) },
        noCache: true,
      });

      const expiredFixedDateCourse = orderCourses.find((course) => isFixedDateCourseExpired(course, todayWarsaw));
      if (expiredFixedDateCourse) {
        return NextResponse.json(
          {
            error: `Kurs "${expiredFixedDateCourse.name}" nie jest już dostępny w sprzedaży.`,
          },
          { status: 400 }
        );
      }
    }

    const productEligibilityMap = new Map<string, Map<string, { _id: string; name?: string }>>();
    if (productIdsNeedingRelation.length > 0) {
      const sanityCourses = await sanityFetch<
        Array<{
          _id: string;
          name?: string;
          type?: 'course' | 'program' | null;
          materials_link?: { _id: string; name?: string } | null;
          related_products?: Array<{ _id: string; name?: string }> | null;
          printed_manual?: { _id: string; name?: string } | null;
          includedByPrograms?: Array<{ _id: string; name?: string; type?: 'program' | null }> | null;
        }>
      >({
        query:
          '*[_type == "course" && references($productIds)]{_id, name, type, "materials_link": materials_link->{_id, name}, "related_products": related_products[]->{_id, name}, "printed_manual": printed_manual->{_id, name}, "includedByPrograms": *[_type == "course" && type == "program" && ^._id in includedCourses[]._ref]{_id, name, type}}',
        params: { productIds: productIdsNeedingRelation },
        noCache: true,
      });

      const productIdSet = new Set(productIdsNeedingRelation);
      const addEligibilityForProduct = (productId: string | undefined, eligibleRefs: Array<{ _id: string; name?: string }>) => {
        if (!productId || !productIdSet.has(productId)) return;

        const currentRefs = productEligibilityMap.get(productId) ?? new Map<string, { _id: string; name?: string }>();

        eligibleRefs.forEach((ref) => {
          if (!ref?._id) return;
          currentRefs.set(ref._id, { _id: ref._id, name: ref.name });
        });

        productEligibilityMap.set(productId, currentRefs);
      };

      sanityCourses?.forEach((course) => {
        const eligibleRefs = [
          { _id: course._id, name: course.name },
          ...(course.includedByPrograms ?? []).map((program) => ({ _id: program._id, name: program.name })),
        ];

        addEligibilityForProduct(course.materials_link?._id, eligibleRefs);
        addEligibilityForProduct(course.printed_manual?._id, eligibleRefs);
        course.related_products?.forEach((product) => {
          addEligibilityForProduct(product?._id, eligibleRefs);
        });
      });
    }

    if (productEligibilityMap.size > 0) {
      const requiredCourseIds = new Set(
        Array.from(productEligibilityMap.values()).flatMap((eligibleRefs) =>
          Array.from(eligibleRefs.values())
            .map((related) => related._id)
            .filter((courseId): courseId is string => typeof courseId === 'string')
        )
      );

      let ownedRelatedCourseIds = new Set<string>();
      if (input.user_id && requiredCourseIds.size > 0) {
        const { data: ownedCoursesData, error: ownedCoursesError } = await supabase
          .from('courses_progress')
          .select('course_id, access_expires_at')
          .eq('owner_id', input.user_id)
          .in('course_id', Array.from(requiredCourseIds));

        if (ownedCoursesError) {
          console.error('Failed to verify course ownership', ownedCoursesError);
          return NextResponse.json({ error: 'Nie udało się zweryfikować uprawnień do kursów' }, { status: 500 });
        }

        ownedRelatedCourseIds = new Set(getActiveOwnedCourseIds(ownedCoursesData ?? []));
      }

      for (const product of productItems) {
        const eligibleRefs = productEligibilityMap.get(product.id);
        if (!eligibleRefs?.size) continue;

        const eligibleIds = Array.from(eligibleRefs.keys());
        const hasCourseInOrder = eligibleIds.some((eligibleId) => orderCourseIds.has(eligibleId));
        const userOwnsCourse = input.user_id ? eligibleIds.some((eligibleId) => ownedRelatedCourseIds.has(eligibleId)) : false;

        if (!hasCourseInOrder && !userOwnsCourse) {
          const eligibleNames = Array.from(eligibleRefs.values())
            .map((related) => related.name)
            .filter((name): name is string => typeof name === 'string' && name.length > 0);
          const eligibleLabel =
            eligibleNames.length === 1
              ? `kursu lub programu "${eligibleNames[0]}"`
              : 'powiązanego kursu lub programu';

          console.warn('Order blocked: product requires related course', {
            productId: product.id,
            relatedCourseIds: eligibleIds,
            userId: input.user_id ?? 'guest',
          });
          return NextResponse.json(
            {
              error: `Produkt "${product.name}" wymaga posiadania ${eligibleLabel}. Dodaj odpowiedni kurs lub program do zamówienia albo zaloguj się na konto z dostępem.`,
            },
            { status: 400 }
          );
        }
      }
    }

    // NOTE: Voucher coupons are NO LONGER created here to prevent orphaned coupons
    // when users click multiple times. Coupons are created AFTER payment confirmation
    // in /api/payment/complete via createVoucherCoupons()
    const products = productItems.map(async (product, index) => {
      const resolvedShipmentDeclaredValue = serverResolvedShipmentDeclaredValues[index] ?? {
        value: null,
        source: null,
      };

      if (product.type === 'voucher') {
        // Don't create coupon yet - just pass voucher data through
        // Coupon will be created after payment is confirmed
        return {
          ...product,
          shipmentDeclaredValue: resolvedShipmentDeclaredValue.value,
          shipmentDeclaredValueSource: resolvedShipmentDeclaredValue.source,
          voucherBase64: null, // Will be generated after payment
          voucherPending: true, // Flag to indicate coupon needs to be created
          vat: 0,
          ryczalt: 3,
        };
      } else {
        return {
          ...product,
          shipmentDeclaredValue: resolvedShipmentDeclaredValue.value,
          shipmentDeclaredValueSource: resolvedShipmentDeclaredValue.source,
          vat: product.courses ? settingsData?.value.vatCourses : settingsData?.value.vatPhysical,
          ryczalt: product.courses ? settingsData?.value.ryczaltCourses : settingsData?.value.ryczaltPhysical,
        };
      }
    });

    // Normalize discounts: support arrays (new) and single discount (legacy)
    const discountsArray = (() => {
      const arr = (
        input as unknown as {
          discounts?: Array<{
            amount: number;
            code: string;
            id: string;
            type: string;
            discounted_products?: Array<{ id: string }>;
            discounted_product?: { id: string } | null;
            eligibleCount?: number;
            totalVoucherAmount?: number | null;
            category_restrictions?: CategoryRestrictions;
            eligibleSubtotal?: number;
          }>;
        }
      ).discounts as
        | Array<{
          amount: number;
          code: string;
          id: string;
          type: string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          discounted_products?: Array<{ id: string }> | any;
          discounted_product?: { id: string } | null;
          eligibleCount?: number;
          totalVoucherAmount?: number | null;
          category_restrictions?: CategoryRestrictions;
          eligibleSubtotal?: number;
          aggregates?: boolean | null;
        }>
        | undefined;
      if (Array.isArray(arr) && arr.length > 0) return arr;
      return input.discount ? [input.discount] : [];
    })();

    // Compute total discounts per coupon; enforce simple v1 rules server-side
    const computeFixedProductTotal = (d: {
      amount: number;
      discounted_products?: Array<{ id: string }> | undefined;
      discounted_product?: { id: string } | null;
      aggregates?: boolean | null;
    }) => {
      const eligibleIds =
        Array.isArray(d.discounted_products) && d.discounted_products.length > 0
          ? d.discounted_products.map((p) => p.id)
          : d.discounted_product?.id
            ? [d.discounted_product.id]
            : [];
      if (eligibleIds.length === 0) return 0;
      const eligibleUnits = productItems.reduce(
        (sum, p) => (eligibleIds.includes(p.id) ? sum + (p.quantity ?? 1) : sum),
        0
      );
      const unitsUsed = d.aggregates === false ? Math.min(1, Math.max(0, eligibleUnits)) : Math.max(0, eligibleUnits);
      return d.amount * unitsUsed;
    };

    // Separate by type
    const fixedProduct = discountsArray.filter((d) => d.type === 'FIXED PRODUCT');
    const voucher = discountsArray.filter((d) => d.type === 'VOUCHER');
    const cartWide = discountsArray.filter((d) => d.type === 'PERCENTAGE' || d.type === 'FIXED CART');

    // CRITICAL FIX: Server-side voucher validation (protect against race conditions)
    if (voucher.length > 0) {
      const voucherId = voucher[0]!.id;
      const { data: freshVoucher, error: voucherError } = await supabase
        .from('coupons')
        .select('voucher_amount_left')
        .eq('id', voucherId)
        .single();

      if (voucherError || !freshVoucher) {
        return NextResponse.json({ error: 'Nie można zweryfikować vouchera' }, { status: 500 });
      }

      if ((freshVoucher.voucher_amount_left ?? 0) <= 0) {
        return NextResponse.json({ error: 'Voucher jest wyczerpany' }, { status: 400 });
      }

      // Update the voucher amount with fresh data from DB
      voucher[0]!.amount = freshVoucher.voucher_amount_left;
    }

    // v1 policy enforcement: reject cart-wide mixes (soft-fail to legacy single)
    if (cartWide.length > 0 && discountsArray.length > 1) {
      return NextResponse.json({ error: 'Nie można łączyć kodów koszykowych z innymi zniżkami' }, { status: 400 });
    }

    // Calculate fixed-product total with per-product price cap to prevent
    // stacked coupons from exceeding any individual product's price
    const fixedProductTotal = (() => {
      if (fixedProduct.length === 0) return 0;
      const perProductDiscount = new Map<string, number>();
      for (const d of fixedProduct) {
        const eligibleIds =
          Array.isArray(d.discounted_products) && d.discounted_products.length > 0
            ? d.discounted_products.map((p) => p.id)
            : d.discounted_product?.id
              ? [d.discounted_product.id]
              : [];
        for (const item of productItems) {
          if (!eligibleIds.includes(item.id)) continue;
          const qty = item.quantity ?? 1;
          const unitsUsed = d.aggregates === false ? Math.min(1, qty) : qty;
          perProductDiscount.set(
            item.id,
            (perProductDiscount.get(item.id) ?? 0) + d.amount * unitsUsed
          );
        }
      }
      let total = 0;
      perProductDiscount.forEach((rawDiscount, productId) => {
        const item = productItems.find((p) => p.id === productId);
        if (!item) return;
        const effectivePrice =
          (typeof item.discount === 'number' ? item.discount : item.price) * (item.quantity ?? 1);
        total += Math.min(rawDiscount, effectivePrice);
      });
      return total;
    })();

    // Base amounts (derived from products + delivery)
    const productsSubtotal = productItems.reduce(
      (acc, p) => acc + (typeof p.discount === 'number' ? p.discount : p.price) * (p.quantity ?? 1),
      0
    );
    const freeShippingThreshold = Number(freeShippingData?.freeDeliveryAmount ?? 0);
    const qualifiesForFreeDelivery = serverChargesDelivery && freeShippingThreshold > 0 && productsSubtotal >= freeShippingThreshold;
    const deliveryAmount = serverNeedDelivery
      ? serverChargesDelivery && !qualifiesForFreeDelivery
        ? (selectedShippingMethod?.price ?? 0)
        : 0
      : 0;
    const persistedShippingMethod = serverNeedDelivery
      ? {
          name: selectedShippingMethod!.name,
          price: deliveryAmount,
          data: selectedShippingMethod!.map ? input.shippingMethod?.data ?? null : '',
        }
      : null;

    // Helper to transform product items for eligibility check
    const transformProductForEligibility = (item: (typeof productItems)[0]) => ({
      _type: item.type as 'course' | 'product' | 'bundle' | 'voucher',
      basis: (item as unknown as { basis?: string }).basis,
      _id: item.id,
      product: item.id,
      quantity: item.quantity ?? 1,
      price: item.price,
      discount: typeof item.discount === 'number' ? item.discount : undefined,
    });

    // If there is a single cart-wide discount (percentage or fixed cart), apply it to products only (NOT delivery)
    let cartWideUsed = 0;
    if (cartWide.length === 1 && discountsArray.length === 1) {
      const d = cartWide[0]!;
      const restrictions = d.category_restrictions;

      // Calculate eligible subtotal - either from restrictions or full products subtotal
      let eligibleSubtotal = productsSubtotal;
      if (restrictions) {
        const itemsForCheck = productItems.map(transformProductForEligibility);
        eligibleSubtotal = calculateEligibleSubtotal(itemsForCheck, restrictions);
      }

      if (d.type === 'PERCENTAGE') {
        const pct = Math.max(0, Math.min(100, d.amount));
        // Percentage of eligible products only - NO DELIVERY
        cartWideUsed = Math.floor((eligibleSubtotal * pct) / 100);
      } else if (d.type === 'FIXED CART') {
        // Fixed amount capped at eligible products subtotal - NO DELIVERY
        cartWideUsed = Math.min(d.amount, eligibleSubtotal);
      }
    }

    // Voucher is applied last and capped by remaining total after fixed-product discounts
    // Voucher also respects category restrictions and does NOT apply to delivery
    const baseAfterFixed = Math.max(0, productsSubtotal - fixedProductTotal - cartWideUsed);
    let voucherUsed = 0;
    if (voucher.length > 0) {
      const v = voucher[0]!;
      const voucherRestrictions = v.category_restrictions;

      // Calculate voucher cap based on restrictions
      let voucherCap = baseAfterFixed;
      if (voucherRestrictions) {
        const itemsForCheck = productItems.map(transformProductForEligibility);
        const eligibleForVoucher = calculateEligibleSubtotal(itemsForCheck, voucherRestrictions);
        // Voucher is capped by the lesser of: eligible items subtotal or remaining after other discounts
        voucherCap = Math.min(eligibleForVoucher, baseAfterFixed);
      }

      // CRITICAL FIX: Use voucher[0]!.amount (remaining balance), NOT totalVoucherAmount (original amount)
      voucherUsed = Math.min(voucherCap, v.amount);
    }

    // Validate virtual money usage: ONLY allowed for courses and bundles
    if (input.virtualMoney && input.virtualMoney > 0) {
      const hasNonCourseProducts = productItems.some((item) => item.type !== 'course' && item.type !== 'bundle');
      if (hasNonCourseProducts) {
        return NextResponse.json(
          { error: 'Wirtualne złotówki można wykorzystać tylko przy zakupie kursów' },
          { status: 400 }
        );
      }
    }

    // Compute final payable total on the server – do NOT trust client-provided totals
    // IMPORTANT: Discounts only apply to products, delivery is always charged separately
    const combinedProductDiscount = cartWideUsed > 0 ? cartWideUsed : fixedProductTotal + voucherUsed;
    const virtualMoneyAmount = input.virtualMoney ? input.virtualMoney * 100 : 0;
    // Calculate discounted products subtotal first, then add delivery
    const discountedProductsTotal = Math.max(0, productsSubtotal - combinedProductDiscount - virtualMoneyAmount);
    const computedFinalTotal = discountedProductsTotal + deliveryAmount;

    // Compose persisted discounts
    const used_discounts = discountsArray.map((d) => {
      if (d.type === 'FIXED PRODUCT') {
        return { ...d, amount: computeFixedProductTotal(d) };
      }
      if (d.type === 'VOUCHER') {
        return { ...d, amount: voucherUsed };
      }
      return d; // PERCENTAGE/FIXED CART not mixed in v1
    });

    // Create order data with guest support
    const orderData = isGuestOrder(input)
      ? {
        user_id: null,
        guest_email: input.billing.email,
        guest_order_token: generateGuestOrderToken(),
        is_guest_order: true,
        products: {
          array: await Promise.all(products),
        },
        status: computedFinalTotal <= 0 ? (serverNeedDelivery ? 2 : 3) : 1,
        billing: input.billing,
        shipping: serverNeedDelivery && !persistedShippingMethod?.data ? input.shipping : null,
        amount: computedFinalTotal,
        shipping_method: persistedShippingMethod,
        used_discounts,
        used_discount: used_discounts.length === 1 ? used_discounts[0]! : null,
        used_virtual_money: null, // Guests cannot use virtual money
        paid_at: null,
        payment_id: null,
        payment_method: 'Przelewy24',
        need_delivery: serverNeedDelivery,
        client_notes: input.client_notes,
        free_delivery: qualifiesForFreeDelivery,
        // Version 2: Discounts apply only to products, not delivery. Supports category_restrictions.
        discount_logic_version: 2,
      }
      : {
        user_id: input.user_id,
        guest_email: null,
        guest_order_token: null,
        is_guest_order: false,
        products: {
          array: await Promise.all(products),
        },
        status: computedFinalTotal <= 0 ? (serverNeedDelivery ? 2 : 3) : 1,
        billing: input.billing,
        shipping: serverNeedDelivery && !persistedShippingMethod?.data ? input.shipping : null,
        amount: computedFinalTotal,
        shipping_method: persistedShippingMethod,
        used_discounts,
        used_discount: used_discounts.length === 1 ? used_discounts[0]! : null,
        used_virtual_money: input.virtualMoney,
        paid_at: null,
        payment_id: null,
        payment_method: 'Przelewy24',
        need_delivery: serverNeedDelivery,
        client_notes: input.client_notes,
        free_delivery: qualifiesForFreeDelivery,
        // Version 2: Discounts apply only to products, not delivery. Supports category_restrictions.
        discount_logic_version: 2,
      };

    const { data, error } = await supabase.from('orders').insert(orderData).select('*').single();


    if (!data || error) {
      throw new Error(error?.message || 'Error while creating order');
    }

    // Use computed final total for branching logic
    if (computedFinalTotal <= 0) {
      // For free orders (100% discount), create voucher coupons immediately
      // since there's no payment webhook to trigger this
      const updatedOrderData = await createVoucherCoupons(data, supabase);

      await checkUsedModifications(updatedOrderData);
      await updateItemsQuantity(updatedOrderData);
      await sendEmails(updatedOrderData);

      // Redirect based on order type
      let redirectUrl: string;
      if (isGuestOrder(input)) {
        redirectUrl = siteUrl + '/dziekujemy-za-zamowienie';
      } else {
        const offerConfigured = await hasPostPurchaseOffer(productItems);
        redirectUrl = offerConfigured
          ? `${siteUrl}/dziekujemy/${data.id}`
          : `${siteUrl}/moje-konto/zakupy/${data.id}`;
      }

      return NextResponse.json({ link: redirectUrl });
    } else {
      const session = String(data.id + 'X' + Math.floor(Math.random() * 10000));


      const order = {
        sessionId: session,
        amount: Number(computedFinalTotal),
        currency: Currency.PLN,
        description: description,
        email: input.billing.email,
        country: Country.Poland,
        language: Language.PL,
        urlReturn: `${siteUrl}/api/payment/verify/?session=${session}&id=${data.id}`,
        urlStatus: `${siteUrl}/api/payment/complete/?session=${session}&id=${data.id}`,
        timeLimit: 60,
        encoding: Encoding.UTF8,
        city: input.billing.city,
        address: input.billing.address1,
        zip: input.billing.postcode,
        client: input.billing.firstName,
      };

      const response = await p24.createTransaction(order);

      // Persist session id for reconciliation/idempotency
      try {
        await supabase.from('orders').update({ payment_id: session }).eq('id', data.id);
      } catch (e) {
        console.error('Failed to persist P24 session id to order', e);
      }

      return NextResponse.json(response);
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
