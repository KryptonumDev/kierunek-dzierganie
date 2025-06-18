import { notFound } from 'next/navigation';
import { QueryMetadata } from '@/global/Seo/query-metadata';

export default function NotFoundPage() {
  notFound();
}

export async function generateMetadata() {
  return await QueryMetadata('NotFound_Page', '/404');
}