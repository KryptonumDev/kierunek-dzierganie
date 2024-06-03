import { createClient } from '@/utils/supabase-admin';
import Hex from 'crypto-js/enc-hex';
import CryptoJS from 'crypto-js';
import countryList from 'react-select-country-list';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateBill(data: any, id: string) {
  const supabase = createClient();

  const { data: settingsData } = await supabase.from('settings').select('value').eq('name', 'ifirma').single();

  // @ts-expect-error TODO: implement types
  const productsWithDiscount = data.products.array.map((product) => {
    let discount = 0;
    let amount = product.discount ?? product.price;

    if (data.used_discount) {
      if (data.used_discount.type === 'PERCENTAGE') {
        discount = data.used_discount.amount;
      } else if (data.used_discount.type === 'FIXED CART') {
        amount = (product.discount ?? product.price) - data.used_discount.amount / data.products.array.length;
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
  });

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
      Nazwa: data.billing.firstName,
      Identyfikator: data.billing.invoiceType === 'Firma' ? data.billing.company : '',
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
    });
  }

  const createBill = async () => {
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

    return await billRes.json();
  };

  let billId = await createBill();
  console.log(billId);

  if (billId.response.Informacja === 'Data sprzedaży musi być zgodna z miesiącem i rokiem księgowym') {
    const url = 'https://www.ifirma.pl/iapi/abonent/miesiacksiegowy.json';
    const user = 'martyna_prochowska@o2.pl';
    const keyType = 'abonent';
    const dataa = {
      MiesiacKsiegowy: 'NAST',
      PrzeniesDaneZPoprzedniegoRoku: false,
    };

    const key = CryptoJS.enc.Hex.parse(process.env.IFIRMA_ABONENT_KEY!);
    const hmac = CryptoJS.HmacSHA1(url + user + keyType + JSON.stringify(dataa), key);
    const hash = Hex.stringify(hmac);

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json; charset=UTF-8',
        Authentication: `IAPIS user=${user}, hmac-sha1=${hash}`,
      },
      body: JSON.stringify(dataa),
    });

    const json = await res.json();

    if (json.response.kod === 0) {
      billId = await createBill();
    }
  }

  await supabase
    .from('orders')
    .update({
      bill: billId.response.Identyfikator ? String(billId.response.Identyfikator) : null,
      status: data.need_delivery ? 2 : 3,
    })
    .eq('id', id);
}
