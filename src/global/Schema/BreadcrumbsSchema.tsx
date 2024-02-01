import { domain } from '@/global/constants';
import type { BreadcrumbsProps } from '@/components/_global/Breadcrumbs';

const BreadcrumbsSchema = ({ data }: BreadcrumbsProps) => {
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            data?.map(({ name, path }, i) => ({
              '@type': 'ListItem',
              position: ++i,
              name: name,
              item: `${domain}${path}`,
            })),
          ],
        }),
      }}
    />
  );
};

export default BreadcrumbsSchema;