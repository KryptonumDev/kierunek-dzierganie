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

    if (data.used_discount) {
      if (data.used_discount.type === 'PERCENTAGE') {
        discount = data.used_discount.amount;
      } else {
        discount = (data.used_discount.amount / data.products.array.length / (product.discount ?? product.price)) * 100;
      }

      return {
        ...product,
        rabat: discount,
      };
    }

    return product;
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
            StawkaVat: settingsData!.value.vatPhysical / 100,
            StawkaRyczaltu: settingsData!.value.ryczaltPhysical / 100,
            Ilosc: product.quantity,
            CenaJednostkowa: (product.discount ?? product.price) / 100,
            NazwaPelna: product.name,
            Jednostka: 'szt',
            TypStawkiVat: 'PRC',
            Rabat: product.rabat,
          };
        }

        return {
          StawkaVat: settingsData!.value.vatCourses / 100,
          StawkaRyczaltu: settingsData!.value.ryczaltCourses / 100,
          Ilosc: 1,
          CenaJednostkowa: (product.discount ?? product.price) / 100,
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

  const billId = await billRes.json();

  await supabase
    .from('orders')
    .update({
      bill: String(billId.response.Identyfikator),
      status: data.need_delivery ? 2 : 3,
    })
    .eq('id', id);
}
