import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

export async function voucher({ amount, date, code }: { amount: string; date: string; code: string }) {
  const url = 'https://kierunekdzierganie.pl/Voucher-bez-dedykacji.pdf';
  const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const fontUrl = 'https://kierunekdzierganie.pl/fonts/Lato-Light.ttf'; // Fetch custom font from FULL UNTAINTED URL
  const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());
  pdfDoc.registerFontkit(fontkit); // Register the `fontkit` instance
  const Lato = await pdfDoc.embedFont(fontBytes);

  const pages = pdfDoc.getPages();

  const firstPage = pages[0]!;
  firstPage.drawText(amount, {
    x: 460,
    y: 486,
    size: 24,
    font: Lato,
    color: rgb(0.27450980392156865, 0.21176470588235294, 0.18823529411764706),
  });

  firstPage.drawText(date, {
    x: 900,
    y: 486,
    size: 24,
    font: Lato,
    color: rgb(0.27450980392156865, 0.21176470588235294, 0.18823529411764706),
  });

  firstPage.drawText(code, {
    x: 770,
    y: 247,
    size: 24,
    font: Lato,
    color: rgb(0.27450980392156865, 0.21176470588235294, 0.18823529411764706),
  });

  return pdfDoc.saveAsBase64({ dataUri: true });
}

export async function dedicatedVoucher({
  amount,
  date,
  code,
  dedication,
}: {
  amount: string;
  date: string;
  code: string;
  dedication: {
    from: string;
    to: string;
    message: string;
  };
}) {
  const url = 'https://kierunekdzierganie.pl/Voucher-dedykacja.pdf';
  const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const fontUrl = 'https://kierunekdzierganie.pl/fonts/Lato-Light.ttf'; // Fetch custom font from FULL UNTAINTED URL
  const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());
  pdfDoc.registerFontkit(fontkit); // Register the `fontkit` instance
  const Lato = await pdfDoc.embedFont(fontBytes);

  const pages = pdfDoc.getPages();

  const firstPage = pages[0]!;

  firstPage.drawText(dedication.from, {
    x: 250,
    y: 560,
    size: 24,
    font: Lato,
    color: rgb(0.27450980392156865, 0.21176470588235294, 0.18823529411764706),
  });

  firstPage.drawText(dedication.to, {
    x: 710,
    y: 560,
    size: 24,
    font: Lato,
    color: rgb(0.27450980392156865, 0.21176470588235294, 0.18823529411764706),
  });

  firstPage.drawText(dedication.message, {
    x: 250,
    y: 475,
    size: 24,
    font: Lato,
    maxWidth: 840,
    lineHeight: 30,
    color: rgb(0.27450980392156865, 0.21176470588235294, 0.18823529411764706),
  });

  firstPage.drawText(amount, {
    x: 512,
    y: 270,
    size: 24,
    font: Lato,
    color: rgb(0.27450980392156865, 0.21176470588235294, 0.18823529411764706),
  });

  firstPage.drawText(date, {
    x: 825,
    y: 270,
    size: 24,
    font: Lato,
    color: rgb(0.27450980392156865, 0.21176470588235294, 0.18823529411764706),
  });

  firstPage.drawText(code, {
    x: 460,
    y: 178,
    size: 24,
    font: Lato,
    color: rgb(0.27450980392156865, 0.21176470588235294, 0.18823529411764706),
  });

  return await pdfDoc.saveAsBase64({ dataUri: true });
}

// useEffect(() => {
//   dedicatedVoucher({
//     amount: '100 zl',
//     date: '2022-12-12',
//     code: '123456',
//     dedication: {
//       to: 'Kasia',
//       from: 'Krzysiek',
//       message: 'Z okazji urodzin okazji urodzin okazji urodzin okazji urodzin okazji urodzin okazji urodzin okazji urodzin okazji urodzin okazji urodzin okazji urodzin okazji urodzin okazji urodzin',
//     },
//   });
// }, []);
