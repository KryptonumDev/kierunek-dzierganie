import Order from 'src/emails/Order';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_TOKEN);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sendEmails(data: any) {
  await resend.emails.send({
    from: 'Kierunek Dzierganie <kontakt@kierunekdzierganie.pl>',
    to: [data.billing.email],
    subject: 'Nowe zamówienie!',
    reply_to: 'kontakt@zrobmimamo.pl',
    text: '',
    react: Order({ data: data, type: data.need_delivery ? 'CREATE_ORDER' : 'ORDER_COMPLETED' }),
  });

  await resend.emails.send({
    from: 'Kierunek Dzierganie <kontakt@kierunekdzierganie.pl>',
    to: ['kierunek.dzierganie@gmail.com'],
    subject: 'Nowe zamówienie!',
    reply_to: 'kontakt@zrobmimamo.pl',
    text: '',
    react: Order({ data: data, type: 'NEW_ORDER' }),
  });
}
