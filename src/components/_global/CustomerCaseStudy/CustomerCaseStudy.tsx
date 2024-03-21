import Markdown from '@/components/ui/markdown';
import Img from '@/components/ui/image';
import Button from '@/components/ui/Button';
import styles from './CustomerCaseStudy.module.scss';
import type { Props } from './CustomerCaseStudy.types';
import Slider from './_Slider';

const CustomerCaseStudy = ({ heading, paragraph, list, index }: Props) => {
  const HeadingComponenet = index === 0 ? Markdown.h1 : Markdown.h2;
  const renderedList = list.map(({ img, slug, ...props }) => ({
    img: (
      <Img
        data={img}
        sizes='(max-width: 649px) 50vw, 252px'
        width={96}
        height={96}
      />
    ) as React.ReactNode,
    cta: <Button href={`/kursanci/${slug}`} className={styles.cta}>Zobacz historię</Button>,
    ...props,
  }));

  return (
    <section className={styles['CustomerCaseStudy']}>
      <header>
        <HeadingComponenet>{heading}</HeadingComponenet>
        <Markdown className={styles.paragraph}>{paragraph}</Markdown>
      </header>
      <Slider list={renderedList} />
    </section>
  );
};

export default CustomerCaseStudy;
