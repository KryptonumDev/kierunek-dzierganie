import { createClient } from '@/utils/supabase-admin';
import CryptoJS from 'crypto-js';
import Hex from 'crypto-js/enc-hex';
import countryList from 'react-select-country-list';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateBill(data: any, id: string) {
  const supabase = createClient();

  const { data: settingsData } = await supabase.from('settings').select('value').eq('name', 'ifirma').single();

  // Support both legacy single discount and new multi-discount array
  const discounts: Array<{
    id: string;
    type: string;
    amount: number;
    discounted_product?: { id: string } | null;
    discounted_products?: Array<{ id: string }>;
    totalVoucherAmount?: number | null;
  }> = Array.isArray(data.used_discounts) ? data.used_discounts : data.used_discount ? [data.used_discount] : [];

  // TEMP: If the bought items is only a voucher, don't generate a bill
  if (
    data.products.array.every(
      (product: { _type: string; type: string }) => product._type === 'voucher' || product.type === 'voucher'
    )
  )
    return;

  // Build base per-unit prices (in cents)
  type Line = {
    id: string;
    price: number;
    discount: number | null;
    quantity: number;
    name: string;
    type: string;
    unitPrice: number;
    vat?: number;
    ryczalt?: number | null;
  };
  const baseLines: Line[] = data.products.array.map(
    (product: {
      id: string;
      price: number;
      discount: number | null;
      quantity: number;
      name: string;
      type: string;
    }) => ({
      ...product,
      unitPrice: (product.discount ?? product.price) as number, // cents
    })
  );

  const shippingPrice: number = data.shipping_method?.price ?? 0;

  // If no discounts, keep original pricing
  let productsWithDiscount: Array<Line & { amount: number; rabat: number }>;
  if (!discounts.length) {
    const mapped = baseLines.map((p: Line) => ({ ...p, amount: p.unitPrice, rabat: 0 }));
    productsWithDiscount = mapped as Array<Line & { amount: number; rabat: number }>;
  } else {
    // Apply PERCENTAGE if it is the only coupon
    const percent = discounts.find((d) => d.type === 'PERCENTAGE');
    if (percent && discounts.length === 1) {
      const pct = Math.max(0, Math.min(100, percent.amount));
      baseLines.forEach((p) => {
        p.unitPrice = Math.max(1, Math.floor((p.unitPrice * (100 - pct)) / 100));
      });
    }

    // Apply FIXED PRODUCT coupons per eligible unit
    const fixedProductCoupons = discounts.filter((d) => d.type === 'FIXED PRODUCT');
    for (const c of fixedProductCoupons) {
      const ids =
        Array.isArray(c.discounted_products) && c.discounted_products.length > 0
          ? c.discounted_products.map((p: { id: string }) => p.id)
          : c.discounted_product?.id
            ? [c.discounted_product.id]
            : [];
      if (ids.length === 0) continue;
      const eligibleUnits = baseLines.filter((p) => ids.includes(p.id)).reduce((sum, p) => sum + (p.quantity ?? 1), 0);
      if (eligibleUnits <= 0) continue;
      const perUnit = Math.floor(c.amount / eligibleUnits);
      baseLines.forEach((p: Line) => {
        if (ids.includes(p.id)) {
          p.unitPrice = Math.max(1, p.unitPrice - perUnit);
        }
      });
    }

    // Sum of current products amount (after fixed-product/percentage)
    const currentProductsTotal = baseLines.reduce((sum: number, p: Line) => sum + p.unitPrice * p.quantity, 0);

    // Apply FIXED CART and VOUCHER amounts (voucher.amount already equals used amount)
    const fixedCartTotal = discounts.filter((d) => d.type === 'FIXED CART').reduce((sum, d) => sum + d.amount, 0);
    const voucherUsed = discounts
      .filter((d) => d.type === 'VOUCHER')
      .reduce((sum, d) => sum + (d.totalVoucherAmount ?? d.amount), 0);
    let remainingFixed = fixedCartTotal + voucherUsed;

    if (remainingFixed > 0 && currentProductsTotal > 0) {
      // Distribute proportionally across products
      const shares = baseLines.map((p: Line) => ({
        id: p.id,
        qty: p.quantity,
        share: (p.unitPrice * p.quantity) / currentProductsTotal,
      }));
      let distributed = 0;
      baseLines.forEach((p: Line, idx: number) => {
        const alloc: number =
          idx === baseLines.length - 1
            ? remainingFixed - distributed
            : Math.floor(remainingFixed * (shares[idx]!.share as number));
        distributed += Math.max(0, alloc);
        const perUnitDeduct = Math.floor(alloc / Math.max(1, p.quantity));
        p.unitPrice = Math.max(1, p.unitPrice - perUnitDeduct);
      });
      // Any remaining undistributed cents will implicitly stay in shipping adjustment below
      remainingFixed = Math.max(0, remainingFixed - distributed);
    }

    // Prepare mapped result
    const mapped2 = baseLines.map((p: Line) => ({ ...p, amount: p.unitPrice, rabat: 0 }));
    productsWithDiscount = mapped2 as Array<Line & { amount: number; rabat: number }>;

    // If remainingFixed still > 0 after product allocation, reduce shipping line
    if (remainingFixed > 0 && data.shipping_method) {
      const newShipping = Math.max(0, shippingPrice - remainingFixed);
      // mutate for later use below
      (data as { shipping_method: { price: number } }).shipping_method.price = newShipping;
    }
  }

  const requestContent = {
    Zaplacono: data.amount / 100,
    LiczOd: 'BRT',
    DataWystawienia: new Date().toISOString().split('T')[0],
    MiejsceWystawienia: 'Miasto',
    DataSprzedazy: new Date(data.created_at).toISOString().split('T')[0],
    FormatDatySprzedazy: 'DZN',
    SposobZaplaty: 'P24',
    RodzajPodpisuOdbiorcy: 'OUP',
    // OUP (osoba upoważniona do otrzymania faktury VAT);
    // UPO (upoważnienie);
    // BPO (bez podpisu odbiorcy);
    // BWO (bez podpisu odbiorcy i wystawcy)
    Numer: null,
    Pozycje: [
      ...productsWithDiscount.map((product) => {
        if (product.type === 'product') {
          return {
            StawkaVat: (product.vat ?? 0) / 100,
            StawkaRyczaltu: product.ryczalt ? product.ryczalt / 100 : null,
            Ilosc: product.quantity,
            CenaJednostkowa: product.amount / 100,
            NazwaPelna: product.name,
            Jednostka: 'szt',
            TypStawkiVat: 'PRC',
            Rabat: product.rabat,
          };
        }

        return {
          StawkaVat: (product.vat ?? 0) / 100,
          StawkaRyczaltu: product.ryczalt ? product.ryczalt / 100 : null,
          Ilosc: 1,
          CenaJednostkowa: product.amount / 100,
          NazwaPelna: product.name,
          Jednostka: 'szt',
          TypStawkiVat: 'PRC',
          Rabat: product.rabat,
        };
      }),
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
    Uwagi: data.used_discount?.type === 'DELIVERY' ? 'Darmowa wysyłka.' : '',
  };

  if (data.shipping_method) {
    requestContent.Pozycje.push({
      StawkaVat: settingsData!.value.vatDelivery / 100,
      StawkaRyczaltu: settingsData!.value.ryczaltPhysical / 100,
      Ilosc: 1,
      CenaJednostkowa: (data.shipping_method.price ?? 0) / 100,
      NazwaPelna: data.shipping_method.name,
      Jednostka: 'szt',
      TypStawkiVat: 'PRC',
      Rabat: 0,
    });
  }

  // Invoice Mocking
  if (process.env.SANDBOX === 'true') {
    console.log('📄 iFirma Mode: DEVELOPMENT (Mocked)');
    console.log('📄 Mock invoice request:', JSON.stringify(requestContent, null, 2));

    // Generate a realistic mock bill ID
    const mockBillId = `DEV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    await supabase
      .from('orders')
      .update({
        bill: mockBillId,
        status: data.need_delivery ? 2 : 3,
      })
      .eq('id', id);

    console.log('📄 Mock bill ID generated:', mockBillId);
    return { success: true, billId: mockBillId };
  }
  // Production: Real iFirma API calls
  console.log('📄 iFirma Mode: PRODUCTION (Real)');
  const currentMonth = await setAccountingMonthToTimestamp(data.created_at);
  console.log(currentMonth);
  const billId = await createBill(requestContent as never);
  console.log(billId);

  await supabase
    .from('orders')
    .update({
      bill: billId.response.Identyfikator ? String(billId.response.Identyfikator) : null,
      status: data.need_delivery ? 2 : 3,
    })
    .eq('id', id);
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
  }).then((res) => {
    console.log(`getAccountingMonth response: ${res}`);
    return res.json();
  });

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
  }).then((res) => {
    console.log(`changeAccountingMonth response: ${res}`);
    return res.json();
  });

  return response;
};

const setAccountingMonthToTimestamp = async (timestamp: string) => {
  const year = new Date(timestamp).getFullYear();
  const month = new Date(timestamp).getMonth() + 1; // getMonth() returns 0-11, so add 1

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

  return currentAccountingMonth;
};

const createBill = async (requestContent: never) => {
  const url = 'https://www.ifirma.pl/iapi/fakturakraj.json';
  const user = 'martyna_prochowska@o2.pl';
  const keyType = 'faktura';

  const key = CryptoJS.enc.Hex.parse(process.env.IFIRMA_API_KEY!);
  const hmac = CryptoJS.HmacSHA1(url + user + keyType + JSON.stringify(requestContent), key);
  const hash = Hex.stringify(hmac);

  const billRes = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json; charset=UTF-8',
      Authentication: `IAPIS user=${user}, hmac-sha1=${hash}`,
    },
    body: JSON.stringify(requestContent),
  });

  console.log(`createBill response: ${billRes}`);

  return await billRes.json();
};
