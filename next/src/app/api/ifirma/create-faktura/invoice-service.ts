import CryptoJS from 'crypto-js';
import Hex from 'crypto-js/enc-hex';
import countryList from 'react-select-country-list';

import { createClient } from '@/utils/supabase-admin';

// Ensure all monetary values sent to iFirma are rounded to 2 decimals (PLN)
const roundTo = (value: number, digits: number = 2): number => {
  const factor = Math.pow(10, digits);
  return Math.round((value + Number.EPSILON) * factor) / factor;
};

// Work in grosze internally; convert to PLN rounded to 2 decimals for payload
const toPln = (grosze: number): number => {
  const roundedGrosze = Math.round(grosze);
  return roundTo(roundedGrosze / 100, 2);
};

export class InvoiceCreationError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number = 400, details?: unknown) {
    super(message);
    this.name = 'InvoiceCreationError';
    this.status = status;
    this.details = details;
  }
}

type CreateInvoiceInput = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  dryRun?: boolean;
  orderId?: number | string;
};

type InvoiceResult =
  | { id: string; alreadyExists?: boolean; mocked?: boolean }
  | { skipped: true; retryable: false; reason: string }
  | {
      dryRun: true;
      message: string;
      calculation: {
        invoiceTotalGrosze: number;
        invoiceTotalPln: number;
        orderAmountGrosze: number;
        orderAmountPln: number;
        match: boolean;
        difference: number;
        differencePln: number;
      };
      voucherAdjustment: {
        minimumAdjustmentGrosze: number;
        minimumAdjustmentPln: number;
        explanation: string;
      };
      productsWithDiscount: Array<{
        name: string;
        amountGrosze: number;
        amountPln: number;
        quantity: number;
        rabat: number;
        lineTotal: number;
      }>;
      shippingGrosze: number | null;
      shippingPln: number | null;
      requestContent: Record<string, unknown>;
    };

export async function createInvoiceForOrder({
  data: rawData,
  dryRun,
  orderId,
}: CreateInvoiceInput): Promise<InvoiceResult> {
  const supabase = createClient();
  let data = rawData;

  if (!data && orderId) {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !orderData) {
      throw new InvoiceCreationError('Nie udało się pobrać danych zamówienia');
    }

    data = orderData;
  }

  if (!data) {
    throw new InvoiceCreationError('Brak danych zamówienia');
  }

  const orderRowId = data.id ?? orderId;
  if (!orderRowId) {
    throw new InvoiceCreationError('Brak identyfikatora zamówienia');
  }

  if (data.bill) {
    return { id: String(data.bill), alreadyExists: true };
  }

  const isVoucherProduct = (product: { _type?: string; type?: string }) =>
    product._type === 'voucher' || product.type === 'voucher';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: settingsData }: { data: { value: any } | null } = (await supabase
    .from('settings')
    .select('value')
    .eq('name', 'ifirma')
    .single()) || { data: { value: null } };

  const discountsArray = Array.isArray(data.used_discounts)
    ? data.used_discounts
    : data.used_discount
      ? [data.used_discount]
      : [];

  const isV2Logic = (data.discount_logic_version ?? 1) >= 2;

  const percentDiscount = discountsArray
    .filter((discount: { type: string }) => discount.type === 'PERCENTAGE')
    .reduce((acc: number, discount: { amount: number }) => acc + (discount.amount ?? 0), 0);

  let remainingFixedCart = discountsArray
    .filter((discount: { type: string }) => discount.type === 'FIXED CART' || discount.type === 'VOUCHER')
    .reduce((acc: number, discount: { amount: number }) => acc + (discount.amount ?? 0), 0);

  const hasFreeDelivery = discountsArray.some((discount: { type: string }) => discount.type === 'DELIVERY');
  const isVoucherOnlyOrder = data.products.array.every((product: { _type?: string; type?: string }) =>
    isVoucherProduct(product)
  );
  const chargeableShippingPrice =
    data.shipping_method && !hasFreeDelivery ? Math.round(data.shipping_method.price ?? 0) : 0;
  const shouldCreateShippingOnlyInvoice = isVoucherOnlyOrder && chargeableShippingPrice > 0;

  if (isVoucherOnlyOrder && !shouldCreateShippingOnlyInvoice) {
    await supabase
      .from('orders')
      .update({
        status: data.need_delivery ? 2 : 3,
      })
      .eq('id', orderRowId);

    return {
      skipped: true,
      retryable: false,
      reason: 'Zamówienie zawiera wyłącznie voucher i nie wymaga wystawienia faktury bez płatnej dostawy.',
    };
  }

  const fixedProductDiscounts = discountsArray.filter(
    (discount: { type: string }) => discount.type === 'FIXED PRODUCT'
  );

  const eligibleProductIds = new Set<string>();
  fixedProductDiscounts.forEach(
    (discount: {
      discounted_product?: { id: string } | null;
      discounted_products?: { id: string }[] | null;
    }) => {
      if (discount.discounted_product?.id) {
        eligibleProductIds.add(discount.discounted_product.id);
      }
      if (Array.isArray(discount.discounted_products)) {
        discount.discounted_products.forEach((product: { id: string }) => eligibleProductIds.add(product.id));
      }
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalEligibleValue = data.products.array
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((product: any) => eligibleProductIds.has(product.id))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .reduce((sum: number, product: any) => sum + (product.discount ?? product.price) * product.quantity, 0);

  const totalFixedProductDiscount = fixedProductDiscounts.reduce(
    (acc: number, discount: { amount: number }) => acc + (discount.amount ?? 0),
    0
  );

  let minimumAdjustmentGrosze = 0;

  // @ts-expect-error hard to model legacy order payloads
  const productsWithDiscount = data.products.array.map((product) => {
    let amount = product.discount ?? product.price;
    const discountPercent = percentDiscount;

    if (eligibleProductIds.has(product.id) && totalFixedProductDiscount > 0 && totalEligibleValue > 0) {
      const productTotalValue = (product.discount ?? product.price) * product.quantity;
      const productShare = productTotalValue / totalEligibleValue;
      const productDiscountAmount = Math.round(totalFixedProductDiscount * productShare);
      const perUnit = productDiscountAmount / product.quantity;
      amount = Math.max(1, amount - perUnit);
    }

    if (remainingFixedCart > 0) {
      const totalProductAmount = amount * product.quantity;
      if (totalProductAmount > remainingFixedCart) {
        const discountPerUnit = remainingFixedCart / product.quantity;
        amount = Math.max(1, amount - discountPerUnit);
        remainingFixedCart = 0;
      } else {
        remainingFixedCart = remainingFixedCart - totalProductAmount;
        minimumAdjustmentGrosze += product.quantity;
        amount = 1;
      }
    }

    return {
      ...product,
      amount,
      rabat: discountPercent,
    };
  });

  let invoiceTotal = 0;
  let finalShippingGrosze: number | null = null;

  if (!shouldCreateShippingOnlyInvoice) {
    productsWithDiscount.forEach((product: { amount: number; quantity: number; rabat: number }) => {
      const unitGrosze = Math.round(product.amount);
      const baseAmount = unitGrosze * product.quantity;
      const discountAmount = product.rabat ? Math.round(baseAmount * (product.rabat / 100)) : 0;
      invoiceTotal += baseAmount - discountAmount;
    });
  }

  if (data.shipping_method && !hasFreeDelivery) {
    let shippingAmount = data.shipping_method.price;

    if (!isV2Logic && remainingFixedCart > 0) {
      shippingAmount = Math.max(1, Math.round(shippingAmount - remainingFixedCart));
      remainingFixedCart = 0;
    }

    shippingAmount = Math.round(shippingAmount);
    invoiceTotal += shippingAmount;
    finalShippingGrosze = shippingAmount;
  }

  invoiceTotal = Math.max(0, invoiceTotal - (shouldCreateShippingOnlyInvoice ? 0 : minimumAdjustmentGrosze));

  const requestContent = {
    Zaplacono: toPln(invoiceTotal),
    LiczOd: 'BRT',
    DataWystawienia: new Date().toISOString().split('T')[0],
    MiejsceWystawienia: 'Miasto',
    DataSprzedazy: new Date(data.created_at).toISOString().split('T')[0],
    FormatDatySprzedazy: 'DZN',
    SposobZaplaty: 'P24',
    RodzajPodpisuOdbiorcy: 'OUP',
    Numer: null,
    Pozycje: [
      ...(!shouldCreateShippingOnlyInvoice
        ? // @ts-expect-error hard to model legacy order payloads
          productsWithDiscount.map((product) => {
            if (product.type === 'product') {
              return {
                StawkaVat: roundTo((product.vat ?? 0) / 100, 2),
                StawkaRyczaltu: product.ryczalt ? roundTo(product.ryczalt / 100, 3) : null,
                Ilosc: product.quantity,
                CenaJednostkowa: toPln(product.amount),
                NazwaPelna: product.name,
                Jednostka: 'szt',
                TypStawkiVat: 'PRC',
                Rabat: product.rabat ? roundTo(product.rabat, 2) : 0,
              };
            }

            return {
              StawkaVat: roundTo((product.vat ?? 0) / 100, 2),
              StawkaRyczaltu: product.ryczalt ? roundTo(product.ryczalt / 100, 3) : null,
              Ilosc: 1,
              CenaJednostkowa: toPln(product.amount),
              NazwaPelna: product.name,
              Jednostka: 'szt',
              TypStawkiVat: 'PRC',
              Rabat: product.rabat ? roundTo(product.rabat, 2) : 0,
            };
          })
        : []),
    ],
    Kontrahent: {
      Nazwa: data.billing.invoiceType === 'Firma' ? data.billing.company : data.billing.firstName,
      Identyfikator: '',
      NIP: data.billing.invoiceType === 'Firma' ? data.billing.nip : '',
      Ulica: data.billing.address1,
      KodPocztowy: data.billing.postcode,
      Kraj: countryList().getLabel(data.billing.country),
      Miejscowosc: data.billing.city,
      Email: data.billing.email,
      OsobaFizyczna: data.billing.invoiceType !== 'Firma',
    },
    Uwagi: hasFreeDelivery ? 'Darmowa wysyłka.' : '',
  };

  if (data.shipping_method && !hasFreeDelivery && finalShippingGrosze !== null) {
    requestContent.Pozycje.push({
      StawkaVat: settingsData?.value?.vatDelivery ? roundTo(settingsData.value.vatDelivery / 100, 2) : 0.23,
      StawkaRyczaltu: settingsData?.value?.ryczaltPhysical
        ? roundTo(settingsData.value.ryczaltPhysical / 100, 3)
        : null,
      Ilosc: 1,
      CenaJednostkowa: toPln(finalShippingGrosze),
      NazwaPelna: data.shipping_method.name,
      Jednostka: 'szt',
      TypStawkiVat: 'PRC',
    });
  }

  if (dryRun) {
    return {
      dryRun: true,
      message: 'Dry run - no invoice created',
      calculation: {
        invoiceTotalGrosze: invoiceTotal,
        invoiceTotalPln: toPln(invoiceTotal),
        orderAmountGrosze: data.amount,
        orderAmountPln: toPln(data.amount),
        match: invoiceTotal === data.amount,
        difference: invoiceTotal - data.amount,
        differencePln: toPln(invoiceTotal - data.amount),
      },
      voucherAdjustment: {
        minimumAdjustmentGrosze,
        minimumAdjustmentPln: toPln(minimumAdjustmentGrosze),
        explanation:
          minimumAdjustmentGrosze > 0
            ? `Subtracted ${minimumAdjustmentGrosze} grosz(e) from invoice total (products fully covered by voucher)`
            : 'No adjustment needed',
      },
      productsWithDiscount: productsWithDiscount.map(
        (product: { name: string; amount: number; quantity: number; rabat: number }) => ({
          name: product.name,
          amountGrosze: product.amount,
          amountPln: toPln(product.amount),
          quantity: product.quantity,
          rabat: product.rabat,
          lineTotal: toPln(product.amount * product.quantity),
        })
      ),
      shippingGrosze: finalShippingGrosze,
      shippingPln: finalShippingGrosze ? toPln(finalShippingGrosze) : null,
      requestContent,
    };
  }

  if (process.env.SANDBOX === 'true') {
    const mockBillId = `DEV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const { error: updateError } = await supabase
      .from('orders')
      .update({
        bill: mockBillId,
        status: data.need_delivery ? 2 : 3,
      })
      .eq('id', orderRowId);

    if (updateError) {
      throw new InvoiceCreationError('Nie udało się zapisać numeru faktury testowej', 500, updateError.message);
    }

    return { id: mockBillId, mocked: true };
  }

  await setAccountingMonthToTimestamp(data.created_at);
  const billData = await createBill(requestContent as never);
  const billId = billData?.response?.Identyfikator ? String(billData.response.Identyfikator) : null;

  if (!billId) {
    throw new InvoiceCreationError('Nie udało się wystawić faktury', 400, billData?.response);
  }

  const { error: updateError } = await supabase
    .from('orders')
    .update({
      bill: billId,
      status: data.need_delivery ? 2 : 3,
    })
    .eq('id', orderRowId);

  if (updateError) {
    throw new InvoiceCreationError('Nie udało się zapisać numeru faktury', 500, updateError.message);
  }

  return { id: billId };
}

const getAccountingMonth = async () => {
  const url = 'https://www.ifirma.pl/iapi/abonent/miesiacksiegowy.json';
  const user = 'martyna_prochowska@o2.pl';
  const keyType = 'abonent';

  const key = CryptoJS.enc.Hex.parse(process.env.IFIRMA_ABONENT_KEY!);
  const hmac = CryptoJS.HmacSHA1(url + user + keyType, key);
  const hash = Hex.stringify(hmac);

  const { response } = await fetch(url, {
    method: 'GET',
    cache: 'no-cache',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json; charset=UTF-8',
      Authentication: `IAPIS user=${user}, hmac-sha1=${hash}`,
    },
  }).then((res) => res.json());

  return {
    accountingYear: response.RokKsiegowy,
    accountingMonth: response.MiesiacKsiegowy,
  };
};

const changeAccountingMonth = async (direction: 'NAST' | 'POPRZ') => {
  const url = 'https://www.ifirma.pl/iapi/abonent/miesiacksiegowy.json';
  const user = 'martyna_prochowska@o2.pl';
  const keyType = 'abonent';
  const data = {
    MiesiacKsiegowy: direction,
    PrzeniesDaneZPoprzedniegoRoku: false,
  };

  const key = CryptoJS.enc.Hex.parse(process.env.IFIRMA_ABONENT_KEY!);
  const hmac = CryptoJS.HmacSHA1(url + user + keyType + JSON.stringify(data), key);
  const hash = Hex.stringify(hmac);

  const { response } = await fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json; charset=UTF-8',
      Authentication: `IAPIS user=${user}, hmac-sha1=${hash}`,
    },
    cache: 'no-cache',
    body: JSON.stringify(data),
  }).then((res) => res.json());

  return response;
};

const setAccountingMonthToTimestamp = async (timestamp: string) => {
  const year = new Date(timestamp).getFullYear();
  const month = new Date(timestamp).getMonth() + 1;

  let currentAccountingMonth = await getAccountingMonth();

  while (currentAccountingMonth.accountingYear !== year || currentAccountingMonth.accountingMonth !== month) {
    if (
      currentAccountingMonth.accountingYear < year ||
      (currentAccountingMonth.accountingYear === year && currentAccountingMonth.accountingMonth < month)
    ) {
      await changeAccountingMonth('NAST');
    } else {
      await changeAccountingMonth('POPRZ');
    }

    currentAccountingMonth = await getAccountingMonth();
  }
};

const createBill = async (requestContent: never) => {
  const url = 'https://www.ifirma.pl/iapi/fakturakraj.json';
  const user = 'martyna_prochowska@o2.pl';
  const keyType = 'faktura';

  const key = CryptoJS.enc.Hex.parse(process.env.IFIRMA_API_KEY!);
  const hmac = CryptoJS.HmacSHA1(url + user + keyType + JSON.stringify(requestContent), key);
  const hash = Hex.stringify(hmac);

  const billResponse = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json; charset=UTF-8',
      Authentication: `IAPIS user=${user}, hmac-sha1=${hash}`,
    },
    body: JSON.stringify(requestContent),
  });

  return await billResponse.json();
};
