import type { InputState } from '@/components/_global/Header/Checkout/Checkout.types';
import { dedicatedVoucher, voucher as generateVoucherPdf } from '@/utils/create-voucher';
import { formatPrice } from '@/utils/price-formatter';
import { createClient } from '@/utils/supabase-admin';
import sanityFetch from '@/utils/sanity.fetch';
import { Country, Currency, Encoding, Language, P24 } from '@ingameltd/node-przelewy24';
import { NextResponse } from 'next/server';
import { checkUsedModifications } from '../complete/check-used-modifications';
import { sendEmails } from '../complete/send-emails';
import { updateItemsQuantity } from '../complete/update-items-quantity';
import { generateRandomCode } from '@/utils/generate-random-code';
import { generateGuestOrderToken, isGuestOrder } from '@/utils/generate-guest-order-token';
// import { pdf } from '@react-pdf/renderer';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { input, description }: { input: InputState; description: string } = await request.json();
  const supabase = createClient();

  console.log('payment/create:input');
  console.log(input);

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

    // Server-side guard: block products whose parent course references them as materials/manuals
    const productIdsNeedingRelation = Array.from(
      new Set(productItems.filter((item) => item.type === 'product').map((item) => item.id))
    );

    console.log('productIdsNeedingRelation', productIdsNeedingRelation);
    console.log('productItems', productItems);



    const productRequiredCourseMap = new Map<string, { _id: string; name?: string }>();
    if (productIdsNeedingRelation.length > 0) {
      const sanityCourses = await sanityFetch<
        Array<{
          _id: string;
          name?: string;
          materials_link?: { _id: string; name?: string } | null;
          related_products?: Array<{ _id: string; name?: string }> | null;
        }>
      >({
        query: '*[_type == "course" && references($productIds)]{_id, name, "materials_link": materials_link->{_id, name}, "related_products": related_products[]->{_id, name}}',
        params: { productIds: productIdsNeedingRelation },
      });

      const productIdSet = new Set(productIdsNeedingRelation);
      sanityCourses?.forEach((course) => {
        if (course.materials_link?._id && productIdSet.has(course.materials_link._id)) {
          productRequiredCourseMap.set(course.materials_link._id, { _id: course._id, name: course.name });
        }
        course.related_products?.forEach((product) => {
          if (product?._id && productIdSet.has(product._id)) {
            productRequiredCourseMap.set(product._id, { _id: course._id, name: course.name });
          }
        });
      });
    }

    if (productRequiredCourseMap.size > 0) {
      const orderCourseIds = new Set<string>();
      productItems.forEach((item) => {
        if (item.type === 'course') {
          orderCourseIds.add(item.id);
        }
        const linkedCourses = (item as { courses?: Array<{ _id?: string }> | null }).courses;
        if (Array.isArray(linkedCourses)) {
          linkedCourses.forEach((course) => {
            if (course?._id) {
              orderCourseIds.add(course._id);
            }
          });
        }
      });

      const requiredCourseIds = new Set(
        Array.from(productRequiredCourseMap.values())
          .map((related) => related._id)
          .filter((courseId): courseId is string => typeof courseId === 'string')
      );

      let ownedRelatedCourseIds = new Set<string>();
      if (input.user_id && requiredCourseIds.size > 0) {
        const { data: ownedCoursesData, error: ownedCoursesError } = await supabase
          .from('courses_progress')
          .select('course_id')
          .eq('owner_id', input.user_id)
          .in('course_id', Array.from(requiredCourseIds));

        if (ownedCoursesError) {
          console.error('Failed to verify course ownership', ownedCoursesError);
          return NextResponse.json({ error: 'Nie udało się zweryfikować uprawnień do kursów' }, { status: 500 });
        }

        ownedRelatedCourseIds = new Set(
          (ownedCoursesData ?? [])
            .map((row) => row.course_id)
            .filter((courseId): courseId is string => typeof courseId === 'string')
        );
      }

      for (const product of productItems) {
        const relatedCourse = productRequiredCourseMap.get(product.id);
        if (!relatedCourse) continue;

        const hasCourseInOrder = orderCourseIds.has(relatedCourse._id);
        const userOwnsCourse = input.user_id ? ownedRelatedCourseIds.has(relatedCourse._id) : false;

        if (!hasCourseInOrder && !userOwnsCourse) {
          console.warn('Order blocked: product requires related course', {
            productId: product.id,
            relatedCourseId: relatedCourse._id,
            userId: input.user_id ?? 'guest',
          });
          return NextResponse.json(
            {
              error: `Produkt "${product.name}" wymaga posiadania kursu "${relatedCourse.name}". Dodaj kurs do zamówienia lub zaloguj się na konto z dostępem do kursu.`,
            },
            { status: 400 }
          );
        }
      }
    }

    const products = productItems.map(async (product) => {
      if (product.type === 'voucher') {
        // create instance in supabase
        const { data, error } = await supabase
          .from('coupons')
          .insert({
            description: 'Voucher',
            type: 5,
            code: generateRandomCode(),
            state: 2,
            amount: product.voucherData!.amount,
            voucher_amount_left: product.voucherData!.amount,
            // three months from now
            expiration_date: new Date(new Date().setMonth(new Date().getMonth() + 3)),
          })
          .select('*')
          .single();

        if (error) {
          console.log('Error while creating voucher: ', error.message);
          return {
            ...product,
            voucherBase64: null,
            vat: 0,
            ryczalt: 0,
          };
        }

        const code = data.code;
        const amount = formatPrice(product.voucherData!.amount);
        const date = data.expiration_date;

        product.voucherData!.dedication;
        const blob = product.voucherData!.dedication
          ? await dedicatedVoucher({ code, date, amount, dedication: product.voucherData!.dedication })
          : await generateVoucherPdf({ code, amount, date });

        return {
          ...product,
          voucherBase64: blob,
          vat: 0,
          ryczalt: 3,
        };
      } else {
        return {
          ...product,
          // @ts-expect-error - product.courses is not defined in types... todo later
          vat: product.courses ? settingsData?.value.vatCourses : settingsData?.value.vatPhysical,
          // @ts-expect-error - product.courses is not defined in types... todo later
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

    // Calculate fixed-product total
    const fixedProductTotal = fixedProduct.reduce((sum, d) => sum + computeFixedProductTotal(d), 0);

    // Base amounts (derived from products + delivery)
    const productsSubtotal = productItems.reduce(
      (acc, p) => acc + (typeof p.discount === 'number' ? p.discount : p.price) * (p.quantity ?? 1),
      0
    );
    const deliveryAmount = input.needDelivery ? (input.shippingMethod?.price ?? 0) : 0;

    // Voucher is applied last and capped by remaining total after fixed-product discounts
    const baseAfterFixed = Math.max(0, productsSubtotal + deliveryAmount - fixedProductTotal);
    // CRITICAL FIX: Use voucher[0]!.amount (remaining balance), NOT totalVoucherAmount (original amount)
    const voucherUsed = voucher.length > 0 ? Math.min(baseAfterFixed, voucher[0]!.amount) : 0;

    // If there is a single cart-wide discount (percentage or fixed cart), apply it to products + delivery
    let cartWideUsed = 0;
    if (cartWide.length === 1 && discountsArray.length === 1) {
      const d = cartWide[0]!;
      if (d.type === 'PERCENTAGE') {
        const pct = Math.max(0, Math.min(100, d.amount));
        cartWideUsed = Math.floor(((productsSubtotal + deliveryAmount) * pct) / 100);
      } else if (d.type === 'FIXED CART') {
        cartWideUsed = Math.min(d.amount, productsSubtotal + deliveryAmount);
      }
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
    const combinedDiscount = cartWideUsed > 0 ? cartWideUsed : fixedProductTotal + voucherUsed;
    const virtualMoneyAmount = input.virtualMoney ? input.virtualMoney * 100 : 0;
    const computedFinalTotal = Math.max(0, productsSubtotal + deliveryAmount - combinedDiscount - virtualMoneyAmount);

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
          status: computedFinalTotal <= 0 ? (input.needDelivery ? 2 : 3) : 1,
          billing: input.billing,
          shipping: input.needDelivery && !input.shippingMethod?.data ? input.shipping : null,
          amount: computedFinalTotal,
          shipping_method: input.needDelivery ? input.shippingMethod : null,
          used_discounts,
          used_discount: used_discounts.length === 1 ? used_discounts[0]! : null,
          used_virtual_money: null, // Guests cannot use virtual money
          paid_at: null,
          payment_id: null,
          payment_method: 'Przelewy24',
          need_delivery: input.needDelivery,
          client_notes: input.client_notes,
          free_delivery: input.freeDelivery,
        }
      : {
          user_id: input.user_id,
          guest_email: null,
          guest_order_token: null,
          is_guest_order: false,
          products: {
            array: await Promise.all(products),
          },
          status: computedFinalTotal <= 0 ? (input.needDelivery ? 2 : 3) : 1,
          billing: input.billing,
          shipping: input.needDelivery && !input.shippingMethod?.data ? input.shipping : null,
          amount: computedFinalTotal,
          shipping_method: input.needDelivery ? input.shippingMethod : null,
          used_discounts,
          used_discount: used_discounts.length === 1 ? used_discounts[0]! : null,
          used_virtual_money: input.virtualMoney,
          paid_at: null,
          payment_id: null,
          payment_method: 'Przelewy24',
          need_delivery: input.needDelivery,
          client_notes: input.client_notes,
          free_delivery: input.freeDelivery,
        };

    const { data, error } = await supabase.from('orders').insert(orderData).select('*').single();


    if (!data || error) {
      throw new Error(error?.message || 'Error while creating order');
    }

    // Use computed final total for branching logic
    if (computedFinalTotal <= 0) {
      await checkUsedModifications(data);
      await updateItemsQuantity(data);
      await sendEmails(data);

      // Redirect based on order type
      const redirectUrl = isGuestOrder(input)
        ? 'https://kierunekdzierganie.pl/dziekujemy-za-zamowienie'
        : `https://kierunekdzierganie.pl/moje-konto/zakupy/${data.id}`;

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
        urlReturn: `https://kierunekdzierganie.pl//api/payment/verify/?session=${session}&id=${data.id}`,
        // TEMPORARY: Testing error emails on preview branch
        urlStatus: `https://kierunek-dzierganie-git-webhook-fix-kryptonum.vercel.app/api/payment/complete/?session=${session}&id=${data.id}`,
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
