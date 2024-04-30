import Img from '@/components/ui/image';
import Link from 'next/link';
import { SearchResultType } from '../Header.types';
import Loader from './Loader';
import Placeholder from './Placeholder';
import styles from './Search.module.scss';
import findSearchedName from './find-searched-name';
import handleItemClick from './handle-item-click';
export default function Courses({
  searchResults,
  passedRef,
  setIsSearching,
}: {
  searchResults: SearchResultType | null;
  passedRef: React.RefObject<HTMLInputElement>;
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
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
              href={`${basis === 'crocheting' ? '/kursy-szydelkowania' : '/kursy-dziergania-na-drutach'}/${slug}`}
              onClick={() => handleItemClick(passedRef, setIsSearching)}
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
