import { Resend } from 'resend';
import Order from 'src/emails/Order';

const resend = new Resend(process.env.RESEND_API_TOKEN);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sendEmails(data: any) {
  console.log(data.products.array);

  let needToSendVoucher = false;

  let attachments = data.products.array
    .map(
      (item: {
        type: 'voucher' | string;
        voucherData: { type: 'DIGITAL' | 'PHYSICAL' };
        name: string;
        voucherBase64: string;
      }) => {
        if (item.type === 'voucher') {
          if (item.voucherData.type === 'DIGITAL') {
            needToSendVoucher = true;
          }
          return {
            filename: item.name + '.pdf',
            // remove data:application/pdf;base64, from string
            content: item.voucherBase64.split(',')[1],
          };
        }

        return null;
      }
    )
    .filter((item: null | never) => {
      return item !== null;
    });

  if (attachments.length === 0) attachments = null;

  await resend.emails.send({
    from: 'Kierunek Dzierganie <kontakt@kierunekdzierganie.pl>',
    to: [data.billing.email],
    subject: 'Nowe zamówienie!',
    reply_to: 'kontakt@kierunekdzierganie.pl',
    text: '',
    attachments: needToSendVoucher ? attachments : null,
    react: Order({ data: data, type: data.need_delivery ? 'CREATE_ORDER' : 'ORDER_COMPLETED' }),
  });

  await resend.emails.send({
    from: 'Kierunek Dzierganie <kontakt@kierunekdzierganie.pl>',
    to: ['kontakt@kierunekdzierganie.pl'],
    subject: 'Nowe zamówienie!',
    reply_to: data.billing.email,
    text: '',
    attachments: [],
    react: Order({ data: data, type: 'NEW_ORDER' }),
  });
}
