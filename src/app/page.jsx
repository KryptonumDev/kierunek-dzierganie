import { Fetch } from "@/utils/fetch-query"
import Hero from "@/components/sections/homepage-hero";

export const runtime = 'edge'

export default async function Home() {
  const { data: { homepage: {
    hero_Heading,
    hero_Paragraph,
    hero_Cta,
    hero_Img
  }}} = await getData();
  
  return (
    <main>
      <Hero data={{
        hero_Heading,
        hero_Paragraph,
        hero_Cta,
        hero_Img
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
      }
    `,
  })
  return { data };
}