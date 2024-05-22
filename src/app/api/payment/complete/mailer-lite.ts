
export async function addToGroup(email: string, name: string, groupID: string) {
  const time = new Date().toISOString();

  await fetch(`https://api.mailerlite.com/api/v2/groups/${groupID}/subscribers`, {
    method: 'POST',
    headers: {
      'X-MailerLite-ApiKey': process.env.MAILERLITE_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, name, signup_time: time }),
  });
}
