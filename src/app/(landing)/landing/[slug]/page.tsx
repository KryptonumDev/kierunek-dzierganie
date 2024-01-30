import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import sanityFetch from '@/utils/sanity.fetch';
import Seo from '@/global/Seo';
import type { generateMetadataProps } from '@/global/types';
import Faq from '@/components/_global/Faq';
import Opinions from '@/components/_global/Opinions';
import TileList from '@/components/_global/TileList';
import CtaSection from '@/components/_global/CtaSection';
import SimpleCtaSection from '@/components/_global/SimpleCtaSection';
import HeroBackgroundImg from '@/components/_global/HeroBackgroundImg';
import Benefits from '@/components/_global/Benefits';
import CourseModules from '@/components/_global/CourseModules';
import ImageShowcase from '@/components/_global/ImageShowcase';
import Bonuses from '@/components/_global/Bonuses';

const LandingPage = async ({ params: { slug } }: { params: { slug: string } }) => {
  const { content } = await query(slug);
  return (
    <>
      {content.map((component, i) => {
        switch (component._type) {
        case 'HeroBackgroundImg':
          return (
            <HeroBackgroundImg
              key={i}
              {...component}
              aboveTheFold={Boolean(i === 0)}
            />
          );
        case 'Benefits':
          return (
            <Benefits
              key={i}
              {...component}
            />
          );
        case 'Faq':
          return (
            <Faq
              key={i}
              {...component}
            />
          );
        case 'Opinions':
          return (
            <Opinions
              key={i}
              {...component}
            />
          );
        case 'TileList':
          return (
            <TileList
              key={i}
              {...component}
            />
          );
        case 'CtaSection':
          return (
            <CtaSection
              key={i}
              {...component}
              aboveTheFold={Boolean(i === 0)}
            />
          );
        case 'SimpleCtaSection':
          return (
            <SimpleCtaSection
              key={i}
              {...component}
            />
          );
        case 'CourseModules':
          return (
            <CourseModules
              key={i}
              {...component}
            />
          );
        case 'ImageShowcase':
          return (
            <ImageShowcase
              key={i}
              {...component}
            />
          );
        case 'Bonuses':
          return (
            <Bonuses
              key={i}
              {...component}
            />
          );
        default:
          break;
        }
      })}
    </>
  );
};

export async function generateMetadata({ params: { slug: paramsSlug } }: { params: { slug: string } }) {
  const {
    slug,
    seo: { title, description },
  } = (await query(paramsSlug)) as generateMetadataProps;
  return Seo({
    title,
    description,
    path: `/landing/${slug}`,
  });
}

const query = async (slug: string) => {
  const data = await sanityFetch({
    query: /* groq */ `
      *[_type == "landingPage" && slug.current == $slug][0] {
        name,
        'slug': slug.current,
        content[] {
          _type == "HeroBackgroundImg" => {
            _type,
            heading,
            paragraph,
            cta {
              theme,
              text,
              href
            },
            cta_Annotation,
            img {
              asset -> {
                url,
                altText,
                metadata {
                  lqip,
                  dimensions {
                    width,
                    height,
                  }
                }
              }
            }
          },
          _type == "Benefits" => {
            _type,
            'benefits': list,
            claim,
            cta {
              theme,
              text,
              href,
            },
            cta_Annotation,
          },
          _type == 'Faq' => {
            _type,
            heading,
            list[] {
              'question': title,
              'answer': description,
            }
          },
          _type == 'Opinions' => {
            _type,
            heading,
            list[] {
              author,
              description,
              gallery[] {
                asset -> {
                  url,
                  altText,
                  metadata {
                    lqip,
                    dimensions {
                      width,
                      height,
                    }
                  }
                }
              }
            },
            paragraph,
            cta {
              theme,
              text,
              href
            },
            cta_Annotation,
          },
          _type == 'TileList' => {
            _type,
            heading,
            list[] {
              title,
              description,
            },
            paragraph,
            cta {
              theme,
              text,
              href,
            },
            cta_Annotation,
          },
          _type == 'CtaSection' => {
            _type,
            isReversed,
            isHighlighted,
            heading,
            paragraph,
            cta {
              theme,
              text,
              href,
            },
            cta_Annotation,
            img {
              asset -> {
                url,
                altText,
                metadata {
                  lqip,
                  dimensions {
                    width,
                    height,
                  }
                }
              }
            }
          },
          _type == 'SimpleCtaSection' => {
            _type,
            heading,
            paragraph,
            cta {
              theme,
              text,
              href,
            },
            cta_Annotation,
          },
          _type == 'CourseModules' => {
            _type,
            heading,
            paragraph,
            list[] {
              title,
              description,
              img {
                asset -> {
                  url,
                  altText,
                  metadata {
                    lqip,
                    dimensions {
                      width,
                      height,
                    }
                  }
                }
              }
            }
          },
          _type == 'ImageShowcase' => {
            _type,
            isGrid,
            heading,
            paragraph,
            cta {
              theme,
              text,
              href,
            },
            cta_Annotation,
            'images': img[] {
              asset -> {
                url,
                altText,
                metadata {
                  lqip,
                  dimensions {
                    width,
                    height,
                  }
                }
              }
            }
          },
          _type == 'Bonuses' => {
            _type,
            heading,
            list[] {
              description,
              img {
                asset -> {
                  url,
                  altText,
                  metadata {
                    lqip,
                    dimensions {
                      width,
                      height,
                    }
                  }
                }
              }
            }
          }
        },
        seo {
          title,
          description,
        }
      }
    `,
    params: { slug },
    isDraftMode: draftMode().isEnabled
  });
  !data && notFound();
  return data;
};

export default LandingPage;

type StaticParamsProps = {
  slug: string;
};

export async function generateStaticParams(): Promise<StaticParamsProps[]> {
  const data: StaticParamsProps[] = await sanityFetch({
    query: /* groq */ `
      *[_type == "landingPage"] {
        'slug': slug.current,
      }
    `
  });

  return data.map(({ slug }) => ({
    slug,
  }));
}
