import Markdown from '@/components/ui/markdown';
import Img from '@/components/ui/image';
import Button from '@/components/ui/Button';
import styles from './CustomerCaseStudy.module.scss';
import Slider from './_Slider';
import type { Props } from './CustomerCaseStudy.types';

const CustomerCaseStudy = ({ heading, paragraph, list, index }: Props) => {
  const HeadingComponenet = index === 0 ? Markdown.h1 : Markdown.h2;
  const renderedList = list.map(({ img, slug, ...props }) => ({
    img: (
      <Img
        data={img}
        sizes='96px'
        width={96}
        height={96}
      />
    ) as React.ReactNode,
    cta: <Button href={`/historia-kursantek/${slug}`} className={styles.cta}>Zobacz historię</Button>,
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
