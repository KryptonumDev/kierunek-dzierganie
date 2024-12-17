import Img from '@/components/ui/image';
import Markdown from '@/components/ui/markdown';
import Form from './_Form';
import styles from './Newsletter.module.scss';
import type { Props } from './Newsletter.types';

const Newsletter = ({ index, heading, img, groupId, dedicatedThankYouPage }: Props) => {
  const HeadingComponenet = index === 0 ? Markdown.h1 : Markdown.h2;
  const Heading = <HeadingComponenet className={styles.heading}>{heading}</HeadingComponenet>;

  console.log(dedicatedThankYouPage?.hasDiscount);

  return (
    <section className={styles['Newsletter']}>
      <Img
        data={img}
        sizes='(max-width: 539px) 90vw, (max-width: 799px) 460px, (max-width: 899px) 33vw, (max-width: 1279px) 40vw, 450px'
      />
      <Form
        Heading={Heading}
        groupId={groupId}
        dedicatedThankYouPage={dedicatedThankYouPage}
      />
    </section>
  );
};

export default Newsletter;
