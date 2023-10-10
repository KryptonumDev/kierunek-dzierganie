import Img from '@/utils/Img';
import Markdown from '@/utils/Markdown';
import styles from './styles.module.scss';

const Frequency = ({
  data: {
    frequency_Heading,
    frequency_Paragraph,
    frequency_Img,
  }
}) => {
  return (
    <section className={styles.wrapper}>
      <header>
        <Markdown.h2>{frequency_Heading}</Markdown.h2>
        <Markdown className={styles.paragraph}>{frequency_Paragraph}</Markdown>
      </header>
      <Img data={frequency_Img} className={styles.img} />
    </section>
  );
};

export default Frequency;