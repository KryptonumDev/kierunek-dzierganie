import sanityFetch from '@/utils/sanity.fetch';
import { DOMAIN } from '@/global/constants';

type QueryTypes = {
  OrganizationSchema: {
    name?: string;
    description?: string;
  };
  email?: string;
  phone?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  linkedin?: string;
  pinterest?: string;
};

const SchemaOrganization = async () => {
  const {
    OrganizationSchema: { name: OrganizationSchema_Name, description: OrganizationSchema_Description },
    email = '',
    phone = '',
    instagram = '',
    facebook = '',
    youtube = '',
    linkedin = '',
    pinterest = '',
  } = await query();

  const socialMediaUrls = [instagram, facebook, youtube, linkedin, pinterest].filter(Boolean);

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          url: `${DOMAIN}`,
          ...(email && { email: email }),
          ...(phone && { telephone: phone }),
          ...(OrganizationSchema_Name && { name: OrganizationSchema_Name }),
          ...(OrganizationSchema_Description && { description: OrganizationSchema_Description }),
          logo: `${DOMAIN}/kierunek-dzierganie-logo.png`,
          image: `${DOMAIN}/kierunek-dzierganie-logo.png`,
          OpeningHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            opens: '00:00',
            closes: '00:00',
          },
          contactPoint: [
            {
              '@type': 'ContactPoint',
              email: email,
            },
          ],
          sameAs: [socialMediaUrls],
        }),
      }}
    />
  );
};

export default SchemaOrganization;

const query = async (): Promise<QueryTypes> => {
  return await sanityFetch<QueryTypes>({
    query: /* groq */ `
      *[_type == "global"][0] {
        OrganizationSchema {
          name,
          description,
        },
        email,
        phone,
        instagram,
        facebook,
        youtube,
        linkedin,
        pinterest,
      }
    `,
    tags: ['global'],
  });
};
