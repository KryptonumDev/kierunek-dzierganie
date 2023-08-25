import Button from '@/components/atoms/Button';
import Heading from '@/utils/Heading';
import Img from '@/utils/Img';
import Markdown from '@/utils/Markdown';
import styles from './styles.module.scss';

const Showcase = ({
  data: {
    showcase_Heading,
    showcase_Images,
    showcase_Paragraph,
    showcase_Cta,
    showcase_CtaAnnotation,
  }
}) => {
  return (
    <section className={styles.wrapper}>
      <Heading level='h2'>{showcase_Heading}</Heading>
      <div className={styles.images}>
        {showcase_Images.map((image, i) => (
          <Img data={image} key={i} />
        ))}
      </div>
      <div className={styles.copy}>
        <Markdown className={styles.paragraph}>{showcase_Paragraph}</Markdown>
        <Button data={showcase_Cta} />
        <Markdown className={styles.ctaAnnotation}>{showcase_CtaAnnotation}</Markdown>
      </div>
    </section>
  );
};

export default Showcase;