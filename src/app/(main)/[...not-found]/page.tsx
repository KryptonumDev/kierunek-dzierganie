import { notFound } from 'next/navigation';
import { QueryMetadata } from '@/global/query-metadata';

const NotFoundPage = () => {
  notFound();
};

export default NotFoundPage;

export async function generateMetadata() {
  return await QueryMetadata('NotFound_Page', '/404');
}
