export async function addToGroup(email: string, name: string, groupID: string) {
  const time = new Date().toISOString();

  const res = await fetch(`https://api.mailerlite.com/api/v2/groups/${groupID}/subscribers`, {
    method: 'POST',
    headers: {
      'X-MailerLite-ApiKey': process.env.MAILERLITE_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, name, signup_time: time }),
  });
  
  return res;
}

export async function removeFromGroup(email: string, groupID: string) {
  const res = await fetch(`https://api.mailerlite.com/api/v2/groups/${groupID}/subscribers/${email}`, {
    method: 'DELETE',
    headers: {
      'X-MailerLite-ApiKey': process.env.MAILERLITE_API_KEY!,
    },
  });
  console.log(res);
}
