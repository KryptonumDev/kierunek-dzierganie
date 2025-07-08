import { P24 } from '@ingameltd/node-przelewy24';

export async function verifyTransaction(amount: number, currency: string, orderId: number, sessionId: string) {
  const p24 = new P24(
    Number(process.env.P24_MERCHANT_ID!),
    Number(process.env.P24_POS_ID!),
    process.env.P24_REST_API_KEY!,
    process.env.P24_CRC!,
    {
      sandbox: process.env.SANDBOX === 'true',
    }
  );

  // Log P24 environment (server-side only)
  if (typeof window === 'undefined') {
    console.log(`💳 P24 Verification Mode: ${process.env.SANDBOX === 'true' ? 'SANDBOX (Test)' : 'PRODUCTION (Real)'}`);
  }

  // verify transaction in P24 service
  await p24.verifyTransaction({
    amount,
    currency,
    orderId,
    sessionId,
  });
}
