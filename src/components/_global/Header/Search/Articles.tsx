import { SearchResultType } from '../Header.types';
import styles from './Search.module.scss';
import Link from 'next/link';
import Img from '@/components/ui/image';
import findSearchedName from './find-searched-name';
import Placeholder from './Placeholder';
import Loader from './Loader';

export default function Articles({
  searchResults,
  passedRef,
}: {
  searchResults: SearchResultType | null;
  passedRef: React.RefObject<HTMLInputElement>;
}) {
  return (
    <div className={styles.blogPosts}>
      <header>
        <h3>Artykuły</h3>
        {searchResults ? <p>{searchResults.blogPosts.length || 0}</p> : <Loader />}
      </header>
      <div className={styles.list}>
        {searchResults ? (
          searchResults.blogPosts.map(({ slug, hero: { heading, img } }, index) => (
            <Link
              className={styles.item}
              key={index}
              href={`/blog/${slug}`}
            >
              <Img
                data={img}
                sizes='48px'
              />
              {findSearchedName(heading, passedRef.current?.value || '')}
            </Link>
          ))
        ) : (
          <>
            {Array.from({ length: 2 }, (_, index) => (
              <Placeholder key={index} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
