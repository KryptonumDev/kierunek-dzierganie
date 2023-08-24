import Heading from '@/utils/Heading';
import Markdown from '@/utils/Markdown';
import styles from './styles.module.scss';

const Standout = ({
  data: {
    standout_Heading,
    standout_Paragraph,
  }
}) => {
  return (
    <section className={styles.wrapper}>
      <Heading level='h2'>{standout_Heading}</Heading>
      <Markdown className={styles.paragraph}>{standout_Paragraph}</Markdown>
    </section>
  );
}
 
export default Standout;