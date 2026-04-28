import { normalizeEmail } from './normalize-email';

type CheckAccountExistsResponse = {
  success: boolean;
  exists?: boolean;
  error?: string;
};

export async function checkAccountExists(email: string) {
  const normalizedEmail = normalizeEmail(email);

  const response = await fetch('/api/auth/check-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: normalizedEmail }),
  });

  const payload = (await response.json().catch(() => null)) as CheckAccountExistsResponse | null;

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error ?? 'Nie udało się sprawdzić adresu e-mail. Spróbuj ponownie.');
  }

  return {
    exists: Boolean(payload.exists),
    normalizedEmail,
  };
}
