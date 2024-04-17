import { createClient, type QueryParams } from 'next-sanity';
import { NextRequest, NextResponse } from 'next/server';

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = 'production';
const apiVersion = '2024-03-20';

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

export async function POST(request: NextRequest) {
  const {
    params,
  }: {
    params?: QueryParams;
  } = await request.json();

  const res = await client.fetch(`

  `, params);

  return NextResponse.json(res);
}
