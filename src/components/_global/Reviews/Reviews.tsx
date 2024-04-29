import Markdown from '@/components/ui/markdown';
import styles from './Reviews.module.scss';
import type { Props } from './Reviews.types';
import Img from '@/components/ui/image';
import Slider from './_Slider';

const Reviews = ({ heading, list }: Props) => {
  const renderedList = list.map(({ images, ...props }) => ({
    images: images?.map((img, i) => <Img data={img} key={i} sizes='(max-width: 649px) 50vw, 252px' />) as React.ReactNode[],
    ...props,
  }));

  return (
    <section className={styles['Reviews']}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
      </header>
      <Slider list={renderedList}/>
    </section>
  );
};

export default Reviews;