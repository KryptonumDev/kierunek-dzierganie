import Img from '@/components/ui/image';
import Link from 'next/link';
import { SearchResultType } from '../Header.types';
import Loader from './Loader';
import Placeholder from './Placeholder';
import styles from './Search.module.scss';
import findSearchedName from './find-searched-name';
import handleItemClick from './handle-item-click';

export default function Articles({
  searchResults,
  passedRef,
  setIsSearching,
}: {
  searchResults: SearchResultType | null;
  passedRef: React.RefObject<HTMLInputElement>;
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
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
              onClick={() => handleItemClick(passedRef, setIsSearching)}
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
