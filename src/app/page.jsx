import { Fetch } from "@/utils/fetch-query"
import Hero from "@/components/sections/homepage-hero";
import Standout from "@/components/sections/homepage-standout";
import Info from "@/components/sections/homepage-info";
import Characteristics from "@/components/sections/homepage-characteristics";
import Benefits from "@/components/sections/homepage-benefits";
import Frequency from "@/components/sections/homepage-frequency";

// export const runtime = 'edge'

export default async function Home() {
  const { data: { homepage: {
    hero_Heading,
    hero_Paragraph,
    hero_Cta,
    hero_Annotation,
    hero_Img,
    standout_Heading,
    standout_Paragraph,
    info_Heading,
    info_List,
    characteristics_List,
    benefits_Heading,
    benefits_List,
    benefits_Paragraph,
    benefits_Cta,
    benefits_CtaAnnotation,
    frequency_Heading,
    frequency_Paragraph,
    frequency_Img,
  }}} = await getData();
  
  return (
    <main>
      <Hero data={{
        hero_Heading,
        hero_Paragraph,
        hero_Cta,
        hero_Annotation,
        hero_Img,
      }} />
      <Standout data={{
        standout_Heading,
        standout_Paragraph,
      }} />
      <Info data={{
        info_Heading,
        info_List,
      }} />
      <Characteristics data={{
        characteristics_List
      }} />
      <Benefits data={{
        benefits_Heading,
        benefits_List,
        benefits_Paragraph,
        benefits_Cta,
        benefits_CtaAnnotation,
      }} />
      <Frequency data={{
        frequency_Heading,
        frequency_Paragraph,
        frequency_Img,
      }} />
    </main>
  )
}


const getData = async () => {
  const { body: { data } } = await Fetch({
    query: `
      homepage: Homepage(id: "homepage") {

        # Hero
        hero_Heading
        hero_Paragraph
        hero_Cta {
          theme
          text
          href
        }
        hero_Annotation
        hero_Img {
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

        # Standout
        standout_Heading
        standout_Paragraph

        # Info
        info_Heading
        info_List {
          title
          description
        }

        # Characteristics
        characteristics_List {
          title
          description
        }

        # Benefits
        benefits_Heading
        benefits_List
        benefits_Paragraph
        benefits_Cta {
          theme
          text
          href
        }
        benefits_CtaAnnotation

        # Frequency
        frequency_Heading
        frequency_Paragraph
        frequency_Img {
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
    `,
  })
  return { data };
}