import Link from 'next/link';
import styles from './ArticleNavigation.module.scss';
import { ArticleNavigationTypes } from './ArticleNavigation.types';

const ArticleNavigation = ({ previousBlog, nextBlog }: ArticleNavigationTypes) => {
  return (
    <div className={styles['ArticleNavigation']}>
      <div>
        {previousBlog && (
          <Link
            href={previousBlog.slug}
            className={styles.previous}
          >
            <div className={styles.arrow}>
              <ArrowLeftIcon />
            </div>
            <span className={styles.indicator}>Poprzedni artykuł</span>
            <span className={styles.name}>{previousBlog.name}</span>
          </Link>
        )}
      </div>
      <div>
        {nextBlog && (
          <Link
            href={nextBlog.slug}
            className={styles.next}
          >
            <span className={`${styles.indicator} ${styles.right}`}>Następny artykuł</span>
            <div className={styles.arrow}>
              <ArrowRightIcon />
            </div>
            <span className={styles.name}>{nextBlog.name}</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ArticleNavigation;

function ArrowLeftIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='23'
      height='9'
      fill='none'
    >
      <path
        stroke='#53423C'
        strokeWidth='0.75'
        d='M22.906 4.216H1.094m0 0l3.75-3.75m-3.75 3.75l3.75 3.75'
      ></path>
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='23'
      height='9'
      fill='none'
    >
      <path
        stroke='#53423C'
        strokeWidth='0.75'
        d='M.094 4.216h21.812m0 0l-3.75-3.75m3.75 3.75l-3.75 3.75'
      ></path>
    </svg>
  );
}
