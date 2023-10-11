import { notFound } from "next/navigation"
import fetchData from "@/utils/fetchData";
import Seo from "@/global/Seo";
import Faq from "@/components/sections/Faq";
import Opinions from "@/components/sections/Opinions";
import TileList from "@/components/sections/TileList";
import CtaSection from "@/components/sections/CtaSection";
import SimpleCtaSection from "@/components/sections/SimpleCtaSection";
import HeroBackgroundImg from "@/components/sections/HeroBackgroundImg";
import Benefits from "@/components/sections/Benefits";
import CourseModules from "@/components/sections/CourseModules";

const LandingPage = async ({ params }) => {
  const {
    content
  } = await getData(params.slug);
  return (
    <>
      {content.map((component, i) => {
        switch (component._type) {
          case 'HeroBackgroundImg':
            return <HeroBackgroundImg key={i} data={component} />
          case 'Benefits':
            return <Benefits key={i} data={component} />
          case 'Faq':
            return <Faq key={i} data={component} />
          case 'Opinions':
            return <Opinions key={i} data={component} />
          case 'TileList':
            return <TileList key={i} data={component} />
          case 'CtaSection':
            return <CtaSection key={i} data={component} />
          case 'SimpleCtaSection':
            return <SimpleCtaSection key={i} data={component} />
          case 'CourseModules':
            return <CourseModules key={i} data={component} />
          default:
            break;
        }
      })}
    </>
  )
}

export async function generateMetadata({ params }) {
  const { slug, seo } = await getData(params.slug);
  return Seo({
    title: seo?.title,
    description: seo?.description,
    url: `/landing/${slug?.current}`,
  })
}

const getData = async (slug) => {
  const { page } = await fetchData(`
    query($slug: String!) {
      page: allLandingPage(where: { slug: { current: { eq: $slug }}}){
        name
        slug {
          current
        }
        
        # Content
        content {
          ... on HeroBackgroundImg {
            _type
            heading
            paragraph
            cta {
              theme
              text
              href
            }
            cta_Annotation
            img {
              asset {
                altText
                url
                metadata {
                  lqip
                  dimensions {
                    width
                    height
                  }
                }
              }
            }
          }
          ... on Benefits {
            _type
            benefits: list
            claim
            cta {
              theme
              text
              href
            }
            cta_Annotation
          }
          ... on Faq {
            _type
            heading
            list {
              question: title
              answer: description
            }
          }
          ... on Opinions {
            _type
            heading
            list {
              author
              description
              gallery {
                asset {
                  altText
                  url
                  metadata {
                    lqip
                    dimensions {
                      width
                      height
                    }
                  }
                }
              }
            }
            paragraph
            cta {
              theme
              text
              href
            }
            cta_Annotation
          }
          ... on TileList {
            _type
            heading
            list {
              title
              description
            }
            paragraph
            cta {
              theme
              text
              href
            }
            cta_Annotation
          }
          ... on CtaSection {
            _type
            isReversed
            isHighlighted
            heading
            paragraph
            cta {
              theme
              text
              href
            }
            cta_Annotation
            img {
              asset {
                altText
                url
                metadata {
                  lqip
                  dimensions {
                    width
                    height
                  }
                }
              }
            }
          }
          ... on SimpleCtaSection {
            _type
            heading
            paragraph
            cta {
              theme
              text
              href
            }
            cta_Annotation
          }
          ... on CourseModules {
            _type
            heading
            paragraph
            list {
              title
              description
              img {
                asset {
                  altText
                  url
                  metadata {
                    lqip
                    dimensions {
                      width
                      height
                    }
                  }
                }
              }
            }
          }
        }

        # SEO
        seo {
          title
          description
        }
      }
    }
  `, {
    slug: slug,
  })

  if(!page[0]?.slug){
    notFound();
  }

  return page[0];
}

export default LandingPage;