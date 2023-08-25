import { Fetch } from "@/utils/fetch-query"
import Hero from "@/components/sections/homepage-hero";
import Standout from "@/components/sections/homepage-standout";
import Info from "@/components/sections/homepage-info";
import Characteristics from "@/components/sections/homepage-characteristics";

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
      }
    `,
  })
  return { data };
}