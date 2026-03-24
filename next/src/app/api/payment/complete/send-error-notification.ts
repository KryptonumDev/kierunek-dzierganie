import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_TOKEN);

interface PaymentErrorContext {
  orderId: string | null;
  sessionId?: string;
  amount?: number;
  currency?: string;
  p24OrderId?: number;
  errorType: 'PARSE_ERROR' | 'VERIFICATION_ERROR' | 'UPDATE_ERROR' | 'PROCESSING_ERROR' | 'UNKNOWN_ERROR';
  errorMessage: string;
  errorStack?: string;
  webhookContentType?: string | null;
  timestamp: string;
}

/**
 * Send error notification email when payment processing fails
 * This helps catch issues like timeouts, verification failures, etc.
 */
export async function sendPaymentErrorNotification(context: PaymentErrorContext) {
  const {
    orderId,
    sessionId,
    amount,
    currency,
    p24OrderId,
    errorType,
    errorMessage,
    errorStack,
    webhookContentType,
    timestamp,
  } = context;

  try {
    const errorTypeLabels: Record<string, string> = {
      PARSE_ERROR: '🔴 Błąd parsowania webhooka',
      VERIFICATION_ERROR: '🔴 Błąd weryfikacji płatności',
      UPDATE_ERROR: '🔴 Błąd aktualizacji zamówienia',
      PROCESSING_ERROR: '🔴 Błąd przetwarzania płatności',
      UNKNOWN_ERROR: '🔴 Nieznany błąd płatności',
    };

    const subject = `${errorTypeLabels[errorType] || '🔴 Błąd płatności'} - Zamówienie ${orderId || 'NIEZNANE'}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">⚠️ Błąd w procesie płatności</h2>
        
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0; color: #991b1b;"><strong>Typ błędu:</strong> ${errorType}</p>
          <p style="margin: 8px 0 0; color: #991b1b;"><strong>Wiadomość:</strong> ${errorMessage}</p>
        </div>

        <h3 style="color: #374151;">📋 Szczegóły zamówienia:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>ID zamówienia:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${orderId || 'Brak'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Session ID:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${sessionId || 'Brak'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>P24 Order ID:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${p24OrderId || 'Brak'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Kwota:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${amount ? `${(amount / 100).toFixed(2)} ${currency || 'PLN'}` : 'Brak'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Content-Type webhooka:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${webhookContentType || 'Nieznany'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Czas wystąpienia:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${timestamp}</td>
          </tr>
        </table>

        ${errorStack ? `
        <h3 style="color: #374151;">🔍 Stack trace:</h3>
        <pre style="background: #f3f4f6; padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 12px;">${errorStack}</pre>
        ` : ''}

        <div style="margin-top: 24px; padding: 16px; background: #fef3c7; border-radius: 8px;">
          <p style="margin: 0; color: #92400e;">
            <strong>⚡ Co zrobić:</strong><br>
            1. Sprawdź panel admina dla zamówienia ${orderId || 'NIEZNANE'}<br>
            2. Sprawdź logi Vercel dla więcej szczegółów<br>
            3. Jeśli klient zapłacił, ręcznie zaktualizuj status zamówienia
          </p>
        </div>

        <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">
          Ten email został wysłany automatycznie przez system Kierunek Dzierganie.
        </p>
      </div>
    `;

    await resend.emails.send({
      from: 'Kierunek Dzierganie <formularz@kierunekdzierganie.pl>',
      to: ['oliwier@kryptonum.eu', 'kontakt@kierunekdzierganie.pl'],
      subject: subject,
      html: htmlContent,
    });

    console.log('📧 Error notification email sent successfully');
  } catch (emailError) {
    // Don't throw - we don't want email failures to mask the original error
    console.error('📧 Failed to send error notification email:', emailError);
  }
}

