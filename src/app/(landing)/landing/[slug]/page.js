import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import Seo from '@/global/Seo';
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
import sanityFetch from '@/utils/sanity.fetch';

const LandingPage = async ({ params: { slug } }) => {
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

export async function generateMetadata({ params: { slug: paramsSlug } }) {
  const { slug, seo } = await query(paramsSlug);
  return Seo({
    title: seo?.title,
    description: seo?.description,
    path: `/landing/${slug}`,
  });
}

const query = async (slug) => {
  const data = await sanityFetch(/* groq */ `
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
  { slug: slug },
  draftMode().isEnabled
  );
  !data && notFound();
  return data;
};

export default LandingPage;

export async function generateStaticParams() {
  const data = await sanityFetch(/* groq */ `
    *[_type == "landingPage"] {
      'slug': slug.current,
    }
  `);

  return data.map(({ slug }) => ({
    slug,
  }));
}
