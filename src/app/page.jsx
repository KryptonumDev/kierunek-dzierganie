import { Fetch } from "@/utils/fetch-query"

export const runtime = 'edge'

export default async function Home() {
  const {  } = await getData()
  return (
    <main>

    </main>
  )
}


async function getData() {
  const { body: { data } } = await Fetch({
    query: `
    query Page {
    }
  `,
    revalidate: 600
  })

  return {}
}