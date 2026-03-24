import CryptoJS from 'crypto-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { bill, type } = await request.json();

  // Environment-aware invoice download
  if (process.env.SANDBOX === 'true') {
    console.log('📄 iFirma Download: DEVELOPMENT (Mocked PDF)');
    console.log(`📄 Mock download request for bill: ${bill}, type: ${type}`);

    // Create a simple mock PDF response
    const mockPdfContent = `Mock Invoice PDF
    
      Bill ID: ${bill}
      Type: ${type || 'original'}
      Generated: ${new Date().toISOString()}

      This is a development mock of the invoice PDF.
      In production, this would be the real iFirma invoice.`;

    const mockPdf = new Blob([mockPdfContent], { type: 'application/pdf' });
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');

    return new NextResponse(mockPdf, { status: 200, statusText: 'OK', headers });
  }

  // Production: Real iFirma API call
  console.log('📄 iFirma Download: PRODUCTION (Real)');
  const url = `https://www.ifirma.pl/iapi/fakturakraj/${bill}.pdf`;
  const user = 'martyna_prochowska@o2.pl';
  const keyType = 'faktura';

  const key = CryptoJS.enc.Hex.parse(process.env.IFIRMA_API_KEY!);
  const hmac = CryptoJS.HmacSHA1(url + user + keyType, key);
  const hash = CryptoJS.enc.Hex.stringify(hmac);

  const billRes = await fetch(url + (type ? '?typ=dup' : ''), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json; charset=UTF-8',
      Authentication: `IAPIS user=${user}, hmac-sha1=${hash}`,
    },
  });

  const blob = await billRes.blob();
  const headers = new Headers();
  headers.set('Content-Type', 'pdf/*');

  return new NextResponse(blob, { status: 200, statusText: 'OK', headers });
}
