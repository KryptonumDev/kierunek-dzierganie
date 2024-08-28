import { cookies } from 'next/headers';

function getClientId() {
  const gaCookie = cookies().get('_ga')?.value || '';
  const parts = gaCookie.split('.');
  if (parts.length >= 4) return `${parts[2]}.${parts[3]}`;
  return null;
}

function getSessionId() {
  const pattern = /GS\d\.\d\.(\d+)\.(\d+)/;
  const match = cookies().get('_ga_F5CD13WL6R')?.value.match(pattern);
  if (match) return match[1];
  return null;
}

export const GAConversionPurchase = async ({ user_id, transaction_id, value, items }: {
  user_id: string;
  transaction_id: string;
  value: number;
  items: {
    item_id: string;
    item_name: string;
    quantity: number;
    price: number;
  }[];
}) => {
  const client_id = getClientId();
  const session_id = getSessionId();

  console.log('[GA4 Event] Sending purchase event with:', {
    user_id,
    client_id,
    session_id,
    transaction_id,
    value,
    items
  });

  const measurementId = 'G-F5CD13WL6R';
  const apiSecret = process.env.GA4_MEASUREMENT_PROTOCOL_API;
  try {
    const response = await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user_id,
        client_id: client_id,
        timestamp_micros: Date.now() * 1000000,
        events: [{
          name: 'purchase',
          params: {
            session_id: session_id,
            transaction_id: transaction_id,
            value: value,
            currency: 'PLN',
            items: items.map(item => ({
              item_id: item.item_id,
              item_name: item.item_name,
              quantity: item.quantity,
              price: item.price
            }))
          }
        }]
      }),
    });
    console.log('GA4 purchase event response:', await response.text());
    if (!response.ok) {
      console.error(`Error sending purchase event: ${response.statusText}`);
    } else {
      console.log('Purchase event successfully sent to GA4');
    }
  } catch (error) {
    console.error('Error sending purchase event to GA4:', error);
  }
};
