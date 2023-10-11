// import fetchData from "@/utils/fetchData";
// import Hero from "@/components/sections/homepage-hero";
// import Standout from "@/components/sections/homepage-standout";
// import Info from "@/components/sections/homepage-info";
// import Characteristics from "@/components/sections/homepage-characteristics";
// import Benefits from "@/components/sections/TileList";
// import Frequency from "@/components/sections/homepage-frequency";
// import Testimonials from "@/components/sections/Opinions";
// import Showcase from "@/components/sections/homepage-showcase";
// import AboutMe from "@/components/sections/CtaSection";
// import CtaSection from "@/components/sections/homepage-ctaSection";
// import Faq from "@/components/sections/Faq";
// import Seo from "@/global/Seo";

// // export const runtime = 'edge'

// const IndexPage = async () => {
//   const { page: {
//     hero_Heading,
//     hero_Paragraph,
//     hero_Cta,
//     hero_Annotation,
//     hero_Img,
//     standout_Heading,
//     standout_Paragraph,
//     info_Heading,
//     info_List,
//     // characteristics_List,
//     benefits_Heading,
//     benefits_List,
//     benefits_Paragraph,
//     benefits_Cta,
//     benefits_CtaAnnotation,
//     frequency_Heading,
//     frequency_Paragraph,
//     frequency_Img,
//     testimonials_Title,
//     testimonials_List,
//     testimonials_Paragraph,
//     testimonials_Cta,
//     testimonials_CtaAnnotation,
//     showcase_Heading,
//     showcase_Images,
//     showcase_Paragraph,
//     showcase_Cta,
//     showcase_CtaAnnotation,
//     aboutMe_Heading,
//     aboutMe_Paragraph,
//     aboutMe_Img,
//     faq_Heading,
//     faq_List,
//     ctaSection_Heading,
//     ctaSection_Paragraph,
//     ctaSection_Cta,
//     ctaSection_CtaAnnotation,
//   }} = await getData();

//   return (
//     <>
//       <Hero data={{
//         hero_Heading,
//         hero_Paragraph,
//         hero_Cta,
//         hero_Annotation,
//         hero_Img,
//       }} />
//       <Standout data={{
//         standout_Heading,
//         standout_Paragraph,
//       }} />
//       <Info data={{
//         info_Heading,
//         info_List,
//       }} />
//       {/* <Characteristics data={{
//         characteristics_List
//       }} /> */}
//       <Benefits data={{
//         benefits_Heading,
//         benefits_List,
//         benefits_Paragraph,
//         benefits_Cta,
//         benefits_CtaAnnotation,
//       }} />
//       <Frequency data={{
//         frequency_Heading,
//         frequency_Paragraph,
//         frequency_Img,
//       }} />
//       <Testimonials data={{
//         testimonials_Title,
//         testimonials_List,
//         testimonials_Paragraph,
//         testimonials_Cta,
//         testimonials_CtaAnnotation,
//       }} />
//       <Showcase data={{
//         showcase_Heading,
//         showcase_Images,
//         showcase_Paragraph,
//         showcase_Cta,
//         showcase_CtaAnnotation,
//       }} />
//       <AboutMe data={{
//         aboutMe_Heading,
//         aboutMe_Paragraph,
//         aboutMe_Img,
//       }} />
//       <Faq data={{
//         faq_Heading,
//         faq_List,
//       }} />
//       <CtaSection data={{
//         ctaSection_Heading,
//         ctaSection_Paragraph,
//         ctaSection_Cta,
//         ctaSection_CtaAnnotation
//       }} />
//     </>
//   )
// }

// export async function generateMetadata() {
//   const { page: { seo } } = await getData();
//   return Seo ({
//     title: seo?.title,
//     description: seo?.description,
//     url: '/'
//   })
// }

// const getData = async () => {
//   return await fetchData(`
//     query {
//       page: Homepage(id: "homepage") {
  
//         # Hero
//         hero_Heading
//         hero_Paragraph
//         hero_Cta {
//           theme
//           text
//           href
//         }
//         hero_Annotation
//         hero_Img {
//           asset {
//             altText
//             url
//             metadata {
//               lqip
//               dimensions {
//                 width
//                 height
//               }
//             }
//           }
//         }
  
//         # Standout
//         standout_Heading
//         standout_Paragraph
  
//         # Info
//         info_Heading
//         info_List {
//           title
//           description
//         }
  
//         # Characteristics
//         # characteristics_List {
//         #   title
//         #   description
//         # }
  
//         # Benefits
//         benefits_Heading
//         benefits_List
//         benefits_Paragraph
//         benefits_Cta {
//           theme
//           text
//           href
//         }
//         benefits_CtaAnnotation
  
//         # Frequency
//         frequency_Heading
//         frequency_Paragraph
//         frequency_Img {
//           asset {
//             altText
//             url
//             metadata {
//               lqip
//               dimensions {
//                 width
//                 height
//               }
//             }
//           }
//         }
  
//         # Testimonials
//         testimonials_Title
//         testimonials_List {
//           author: title
//           content: description
//         }
//         testimonials_Paragraph
//         testimonials_Cta {
//           theme
//           text
//           href
//         }
//         testimonials_CtaAnnotation
  
//         # Showcase
//         showcase_Heading
//         showcase_Images {
//           asset {
//             altText
//             url
//             metadata {
//               lqip
//               dimensions {
//                 width
//                 height
//               }
//             }
//           }
//         }
//         showcase_Paragraph
//         showcase_Cta {
//           theme
//           text
//           href
//         }
//         showcase_CtaAnnotation
  
//         # About me
//         aboutMe_Heading
//         aboutMe_Paragraph
//         aboutMe_Img {
//           asset {
//             altText
//             url
//             metadata {
//               lqip
//               dimensions {
//                 width
//                 height
//               }
//             }
//           }
//         }
  
//         # FAQ
//         faq_Heading
//         faq_List {
//           question: title
//           answer: description
//         }
  
//         # Cta Section
//         ctaSection_Heading
//         ctaSection_Paragraph
//         ctaSection_Cta {
//           theme
//           text
//           href
//         }
//         ctaSection_CtaAnnotation
  
//         # SEO
//         seo {
//           title
//           description
//         }
//       }
//     }
//   `)
// }

// export default IndexPage;