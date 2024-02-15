import Markdown from '@/components/ui/markdown';
import Button from '@/components/ui/Button';
import styles from './Partners.module.scss';
import type { Props } from './Partners.types';
import Img from '@/components/ui/image';
import Slider from './_Slider';

const Partners = ({ heading, paragraph, cta, list, index }: Props) => {
  const HeadingComponenet = index === 0 ? Markdown.h1 : Markdown.h2;
  const renderedList = list.map(({ img, ...props }) => ({
    img: <Img data={img} sizes='' />,
    ...props
  }));

  return (
    <section className={styles['Partners']}>
      <header>
        <HeadingComponenet>{heading}</HeadingComponenet>
        <Markdown className={styles.paragraph}>{paragraph}</Markdown>
        {cta && <Button data={cta} className={styles.cta} />}
      </header>
      <Slider list={renderedList} />
    </section>
  );
};

export default Partners;