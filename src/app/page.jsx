import { Fetch } from "@/utils/fetch-query"
import Hero from "@/components/sections/homepage-hero";
import Standout from "@/components/sections/homepage-standout";

export const runtime = 'edge'

export default async function Home() {
  const { data: { homepage: {
    hero_Heading,
    hero_Paragraph,
    hero_Cta,
    hero_Annotation,
    hero_Img,
    standout_Heading,
    standout_Paragraph,
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
    </main>
  )
}


const getData = async () => {
  const { body: { data } } = await Fetch({
    query: `
      homepage: Homepage(id: "homepage") {
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
        standout_Heading
        standout_Paragraph
      }
    `,
  })
  return { data };
}