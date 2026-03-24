function getMailerLiteApiKey() {
  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) {
    throw new Error('MAILERLITE_API_KEY is not configured');
  }

  return apiKey;
}

async function parseMailerLiteResponse(res: Response) {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return await res.json();
  }

  return await res.text();
}

export async function addToGroup(email: string, name: string, groupID: string) {
  const time = new Date().toISOString();

  const res = await fetch(`https://api.mailerlite.com/api/v2/groups/${groupID}/subscribers`, {
    method: 'POST',
    headers: {
      'X-MailerLite-ApiKey': getMailerLiteApiKey(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, name, signup_time: time }),
  });

  const payload = await parseMailerLiteResponse(res);
  if (!res.ok) {
    throw new Error(`MailerLite addToGroup failed (${res.status}): ${JSON.stringify(payload)}`);
  }

  return payload;
}

export async function removeFromGroup(email: string, groupID: string) {
  const res = await fetch(`https://api.mailerlite.com/api/v2/groups/${groupID}/subscribers/${encodeURIComponent(email)}`, {
    method: 'DELETE',
    headers: {
      'X-MailerLite-ApiKey': getMailerLiteApiKey(),
    },
  });

  if (res.status === 404) {
    return { ok: true, alreadyRemoved: true };
  }

  const payload = await parseMailerLiteResponse(res);
  if (!res.ok) {
    throw new Error(`MailerLite removeFromGroup failed (${res.status}): ${JSON.stringify(payload)}`);
  }

  return payload;
}
