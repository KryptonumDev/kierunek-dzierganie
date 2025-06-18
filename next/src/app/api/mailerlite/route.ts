import { REGEX } from '@/global/constants';

type RequestProps = {
  email: string;
  name: string;
  groupID: string;
};

export async function POST(request: Request) {
  const req = await request.json();
  const { email, name, groupID }: RequestProps = req;
  const time = new Date().toISOString();

  if (!REGEX.email.test(email) || !REGEX.string.test(name)) {
    return Response.json({ success: false }, { status: 422 });
  }

  try {
    const api = await fetch(`https://api.mailerlite.com/api/v2/groups/${groupID}/subscribers`, {
      method: 'POST',
      headers: {
        'X-MailerLite-ApiKey': process.env.MAILERLITE_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name,
        signup_time: time,
        resubscribe: true,
      }),
    });
    if (api.status !== 200) {
      return Response.json({ success: false }, { status: 422 });
    }

    return Response.json({ success: true });
  } catch {
    return Response.json({ success: false }, { status: 422 });
  }
}
