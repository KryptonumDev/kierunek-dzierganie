import Button from "@/components/atoms/Button";
import Heading from "@/utils/Heading";
import Markdown from "@/utils/Markdown";

const Hero = ({
  data: {
    hero_Heading,
    hero_Paragraph,
    hero_Cta,
    hero_Img
  }
}) => {
  return (
    <section>
      <Heading level='h1'>{hero_Heading}</Heading>
      <Markdown className='paragraph'>{hero_Paragraph}</Markdown>
      <Button data={hero_Cta} />
    </section>
  );
}
 
export default Hero;