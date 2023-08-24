import { Fetch } from "@/utils/fetch-query"
import Heading from "@/utils/Heading";
import Markdown from "@/utils/Markdown";

export const runtime = 'edge'

export default async function Home() {
  const { data: { homepage: {
    hero_Heading,
    hero_Paragraph,
  }}} = await getData();
  return (
    <main>
      <Heading level='h1'>{hero_Heading}</Heading>
      <Markdown className='paragraph'>{hero_Paragraph}</Markdown>
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
      }
    `,
  })
  return { data };
}