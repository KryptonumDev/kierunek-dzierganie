import Img from '@/components/ui/image';
import Link from 'next/link';
import { type SearchResultType } from '../Header.types';
import Loader from './Loader';
import Placeholder from './Placeholder';
import styles from './Search.module.scss';
import findSearchedName from './find-searched-name';
import handleItemClick from './handle-item-click';

export default function Products({
  searchResults,
  passedRef,
  setIsSearching,
}: {
  searchResults: SearchResultType | null;
  passedRef: React.RefObject<HTMLInputElement>;
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className={styles.physicalProducts}>
      <header>
        <h3>Produkty fizyczne</h3>
        {searchResults ? (
          <p>{`${searchResults.physicalProducts?.length + searchResults.variableProducts?.length}`}</p>
        ) : (
          <Loader />
        )}
      </header>
      <div className={styles.list}>
        {searchResults ? (
          searchResults.physicalProducts?.map(({ name, slug, gallery, basis }, index) => (
            <Link
              className={styles.item}
              key={index}
              href={`${basis === 'crocheting' ? '/produkty-do-szydelkowania' : '/produkty-do-dziergania'}/${slug}`}
              onClick={() => handleItemClick(passedRef, setIsSearching)}
            >
              <Img
                data={gallery}
                sizes='48px'
              />
              {findSearchedName(name, passedRef.current?.value || '')}
            </Link>
          ))
        ) : (
          <>
            {Array.from({ length: 1 }, (_, index) => (
              <Placeholder key={index} />
            ))}
          </>
        )}
        {searchResults ? (
          searchResults.variableProducts?.map(({ name, slug, variants: { gallery }, basis }, index) => (
            <Link
              className={styles.item}
              key={index}
              href={`${basis === 'crocheting' ? '/produkty-do-szydelkowania' : '/produkty-do-dziergania'}/${slug}`}
              onClick={() => handleItemClick(passedRef, setIsSearching)}
            >
              <Img
                data={gallery}
                sizes='48px'
              />
              {findSearchedName(name, passedRef.current?.value || '')}
            </Link>
          ))
        ) : (
          <>
            {Array.from({ length: 1 }, (_, index) => (
              <Placeholder key={index} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
