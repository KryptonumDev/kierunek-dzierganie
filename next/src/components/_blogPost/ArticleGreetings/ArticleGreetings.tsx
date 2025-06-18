import Img from '@/components/ui/image';
import styles from './ArticleGreetings.module.scss';
import type { ArticleGreetingsTypes } from './ArticleGreetings.types';
import Markdown from '@/components/ui/markdown';

const ArticleGreetings = ({ author: { img, name }, text }: ArticleGreetingsTypes) => {
  return (
    <div className={styles['ArticleGreetings']}>
      <Img
        data={img}
        sizes='33vw'
      />
      <p className={styles.text}>{text}</p>
      <Markdown.h2 className={styles.name}>{name}</Markdown.h2>
    </div>
  );
};

export default ArticleGreetings;
