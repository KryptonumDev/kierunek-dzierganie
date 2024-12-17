import { REGEX } from '@/global/constants';
import { generateRandomCode } from '@/utils/generate-random-code';
import { createClient } from '@/utils/supabase-admin';

type RequestProps = {
  email: string;
  groupID: string;
  name: string;
  duration: number;
  amount: number;
};

export async function POST(request: Request) {
  try {
    const req = await request.json();
    const { email, name, groupID, duration, amount }: RequestProps = req;
    const time = new Date().toISOString();

    if (!REGEX.email.test(email) || !REGEX.string.test(name)) {
      return Response.json({ success: false }, { status: 422 });
    }

    const subscribersResponse = await fetch(`https://api.mailerlite.com/api/v2/groups/${groupID}/subscribers`, {
      method: 'GET',
      headers: {
        'X-MailerLite-ApiKey': process.env.MAILERLITE_API_KEY!,
        'Content-Type': 'application/json',
      },
    });

    const subscribers = await subscribersResponse.json();

    console.log(subscribers);

    const existingSubscriber = subscribers.find((subscriber: { email: string }) => subscriber.email === email);

    if (!existingSubscriber) {
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

      if (!api.ok) {
        return Response.json({ success: false }, { status: 422 });
      }

      await createDiscount(email, groupID, duration, amount);
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false }, { status: 422 });
  }
}

const createDiscount = async (email: string, groupID: string, duration: number, amount: number) => {
  const supabase = createClient();

  const { error } = await supabase
    .from('coupons')
    .insert({
      description: 'Course Discount',
      course_discount_data: {
        email: email,
        group_id: groupID,
      },
      type: 3,
      code: generateRandomCode(),
      state: 2,
      amount,
      expiration_date: new Date(new Date().getTime() + duration * 60000),
    })
    .select('*')
    .single();

  if (error) throw new Error(error.message);
};
