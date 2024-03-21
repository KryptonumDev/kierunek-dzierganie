import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { DOMAIN, REGEX } from '@/global/constants';
import { removeHtmlTags } from '@/utils/remove-html-tags';

type RequestProps = {
  name: string;
  email: string;
  tel?: string;
  message: string;
  legal: boolean;
};

const resend = new Resend(process.env.RESEND_API_TOKEN);

const emailData = {
  from: 'Martyna z Kierunek Dzierganie <kontakt@kierunekdzierganie.pl>',
  to: 'bogumil@kryptonum.eu', // TODO: change emailData.to
};

const headers = {
  'Access-Control-Allow-Origin': DOMAIN,
  'Access-Control-Allow-Methods': 'POST',
};

export async function POST(request: Request) {
  const req = await request.json();
  const { name, email, tel, message, legal }: RequestProps = req;

  if (!name || (!email && !REGEX.email.test(email)) || (tel && !REGEX.phone.test(tel)) || !message || !legal) {
    return NextResponse.json({ success: false }, { status: 422, headers });
  }

  const body = `<p>Imię: <b>${name}</b></p>
  <p>Adres e-mail: <b>${email}</b></p>
  <p>Nr. telefonu: <b>${tel || 'Nie podano'}</b></p>
  <p>${message.trim() || ''}</p>
  <br />
  <br />
  <p><em>Wyrażono zgodnę na politykę prywatności</em></p>
  `;

  try {
    await resend.emails.send({
      from: emailData.from,
      reply_to: email,
      to: emailData.to,
      subject: `${email} wysłał wiadomość przez formularz kontaktowy`,
      html: body,
      text: removeHtmlTags(body),
    });
    return NextResponse.json({ success: true }, { headers });
  } catch {
    return NextResponse.json({ success: false }, { headers });
  }
}
