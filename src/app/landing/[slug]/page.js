import { notFound } from "next/navigation"
import fetchData from "@/utils/fetchData";
import Seo from "@/global/Seo";
import Faq from "@/components/sections/Faq";


const LandingPage = async ({ params }) => {
  const {
    content
  } = await getData(params.slug);
  return (
    <>
      {content.map((component, i) => {
        switch (component._type) {
          case 'Faq':
            return <Faq key={i} data={component} />
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
          ... on Faq {
            _type
            heading
            list {
              question: title
              answer: description
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