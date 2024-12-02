import { createClient } from '@/utils/supabase-admin';
import CryptoJS from 'crypto-js';
import Hex from 'crypto-js/enc-hex';
import countryList from 'react-select-country-list';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateBill(data: any, id: string) {
  const supabase = createClient();

  const { data: settingsData } = await supabase.from('settings').select('value').eq('name', 'ifirma').single();

  let fixedDiscountAmount = data.used_discount?.amount ?? 0;
  let counter = 0;

  const isDiscountBiggerOrEqual =
    (data.used_discount?.type === 'FIXED CART' || data.used_discount?.type === 'VOUCHER') &&
    fixedDiscountAmount >=
      data.products.array.reduce(
        (acc: number, product: { price: number; discount: number | null; quantity: number }) =>
          acc + (product.discount ?? product.price) * product.quantity,
        0
      );

  const productsWithDiscount = !isDiscountBiggerOrEqual
    ? // @ts-expect-error TODO: implement types
      data.products.array.map((product) => {
        let discount = 0;
        let amount = product.discount ?? product.price;

        if (data.used_discount) {
          if (data.used_discount.type === 'PERCENTAGE') {
            discount = data.used_discount.amount;
          } else if (data.used_discount.type === 'FIXED CART' || data.used_discount.type === 'VOUCHER') {
            if (amount > fixedDiscountAmount) {
              amount = amount - fixedDiscountAmount;
              fixedDiscountAmount = 0;
              amount = amount - counter;
            } else {
              fixedDiscountAmount = fixedDiscountAmount - amount;
              amount = 1;
              counter = counter + 1;
            }
          } else if (data.used_discount.type === 'FIXED PRODUCT') {
            data.used_discount.discounted_product.id === product.id
              ? (amount = (product.discount ?? product.price) - data.used_discount.amount / product.quantity)
              : (discount = 0);
          }
        }

        return {
          ...product,
          amount: amount,
          rabat: discount,
        };
      })
    : data.products.array;

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
      // @ts-expect-error hard to implement types here
      ...productsWithDiscount.map((product) => {
        if (product.type === 'product') {
          return {
            StawkaVat: product.vat / 100,
            StawkaRyczaltu: product.ryczalt / 100,
            Ilosc: product.quantity,
            CenaJednostkowa: product.amount / 100,
            NazwaPelna: product.name,
            Jednostka: 'szt',
            TypStawkiVat: 'PRC',
            Rabat: product.rabat,
          };
        }

        return {
          StawkaVat: product.vat / 100,
          StawkaRyczaltu: product.ryczalt / 100,
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
  };

  if (data.shipping_method) {
    requestContent.Pozycje.push({
      StawkaVat: settingsData!.value.vatDelivery / 100,
      StawkaRyczaltu: settingsData!.value.ryczaltPhysical / 100,
      Ilosc: 1,
      CenaJednostkowa: data.shipping_method.price / 100,
      NazwaPelna: data.shipping_method.name,
      Jednostka: 'szt',
      TypStawkiVat: 'PRC',
      Rabat: data.used_discount?.type === 'DELIVERY' ? 100 : 0,
    });
  }

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
