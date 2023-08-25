import styles from './styles.module.scss';
import Button from "@/components/atoms/Button";
import Heading from "@/utils/Heading";
import Img from "@/utils/Img";
import Markdown from "@/utils/Markdown";

const Hero = ({
  data: {
    hero_Heading,
    hero_Paragraph,
    hero_Cta,
    hero_Annotation,
    hero_Img
  }
}) => {
  return (
    <section className={styles.wrapper}>
      <header>
        <Heading level='h1'>{hero_Heading}</Heading>
        <Markdown className={styles.paragraph}>{hero_Paragraph}</Markdown>
        <Button data={hero_Cta} />
        <Markdown className={styles.annotation}>{hero_Annotation}</Markdown>
      </header>
      <Img data={hero_Img} loading='eager' />
    </section>
  );
}
 
export default Hero;