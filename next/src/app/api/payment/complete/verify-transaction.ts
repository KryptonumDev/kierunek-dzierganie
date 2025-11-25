import { P24 } from '@ingameltd/node-przelewy24';

// Timeout in milliseconds for P24 verification API call
// Set to 8 seconds to leave buffer before P24's webhook timeout (~15s)
const VERIFICATION_TIMEOUT_MS = 10000;

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

  // Create a timeout promise that rejects after VERIFICATION_TIMEOUT_MS
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`P24 verification timeout after ${VERIFICATION_TIMEOUT_MS / 1000} seconds - P24 API did not respond in time`));
    }, VERIFICATION_TIMEOUT_MS);
  });

  // Race the verification against the timeout
  // If P24 API is slow, we fail fast and can notify the client
  const verifyPromise = p24.verifyTransaction({
    amount,
    currency,
    orderId,
    sessionId,
  });

  console.log('⏱️ Starting P24 verification with timeout:', {
    timeoutMs: VERIFICATION_TIMEOUT_MS,
    amount,
    orderId,
    sessionId,
  });

  const startTime = Date.now();
  
  try {
    await Promise.race([verifyPromise, timeoutPromise]);
    const duration = Date.now() - startTime;
    console.log(`⏱️ P24 verification completed in ${duration}ms`);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`⏱️ P24 verification failed after ${duration}ms:`, error);
    throw error;
  }
}
