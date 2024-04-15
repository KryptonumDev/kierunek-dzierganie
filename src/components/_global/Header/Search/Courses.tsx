import { SearchResultType } from '../Header.types';
import styles from './Search.module.scss';
import Link from 'next/link';
import Placeholder from './Placeholder';
import Loader from './Loader';
import findSearchedName from './find-searched-name';
import Img from '@/components/ui/image';

export default function Courses({
  searchResults,
  passedRef,
}: {
  searchResults: SearchResultType | null;
  passedRef: React.RefObject<HTMLInputElement>;
}) {
  return (
    <div className={styles.courses}>
      <header>
        <h3>Kursy</h3>
        {searchResults ? <p>{searchResults.courses?.length}</p> : <Loader />}
      </header>
      <div className={styles.list}>
        {searchResults ? (
          searchResults.courses?.map(({ name, basis, slug, course: { image } }, index) => (
            <Link
              className={styles.item}
              key={index}
              href={`${basis === 'crocheting' ? '/kursy-dziergania-na-drutach' : '/kursy-szydelkowania'}/${slug}`}
            >
              <Img
                data={image}
                sizes='48px'
              />
              {findSearchedName(name, passedRef.current?.value || '')}
            </Link>
          ))
        ) : (
          <>
            {Array.from({ length: 4 }, (_, index) => (
              <Placeholder key={index} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
