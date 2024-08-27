import { cookies } from 'next/headers';
import crypto from 'crypto';

function getFbp() {
  return cookies().get('_fbp')?.value || '';
}
function getFbc() {
  return cookies().get('_fbc')?.value || '';
}
function hashData(data: string) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export const MetaConversionPurchase = async ({ user_id, transaction_id, value, items, email }: {
  user_id: string;
  transaction_id: string;
  value: number;
  items: {
    item_id: string;
    item_name: string;
    quantity: number;
    price: number;
  }[];
  email: string;
}) => {
  const event_id = crypto.randomBytes(16).toString('hex');
  const fbp = getFbp();
  const fbc = getFbc();

  console.log('[Meta Event] Sending purchase event with:', {
    user_id,
    transaction_id,
    value,
    items,
  });

  const META_PIXEL_ID = '106002735936658';
  const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

  try {
    const response = await fetch(`https://graph.facebook.com/v20.0/${META_PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [{
          event_id: event_id,
          event_name: 'Purchase',
          event_time: Math.floor(Date.now() / 1000),
          user_data: {
            em: hashData(email.toLowerCase()),
            external_id: hashData(user_id),
            fbp: fbp,
            fbc: fbc,
          },
          custom_data: {
            currency: 'PLN',
            value: value,
            content_ids: items.map(item => item.item_id),
            contents: items.map(item => ({
              id: item.item_id,
              quantity: item.quantity,
            })),
            content_type: 'product',
            order_id: transaction_id,
          },
        }],
      }),
    });

    console.log('Meta purchase event response:', await response.json());
    if (!response.ok) {
      console.error(`Error sending purchase event: ${response.statusText}`);
    } else {
      console.log('Purchase event successfully sent to Meta');
    }
  } catch (error) {
    console.error('Error sending purchase event to Meta:', error);
  }
};
