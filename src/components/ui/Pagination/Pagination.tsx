import { useMemo } from 'react';
import styles from './Pagination.module.scss';
import type { PaginationTypes } from './Pagination.types';
import Link from 'next/link';

const Pagination = ({
  selectedNumber = 1,
  numberOfElements,
  elementsDivider,
  pathPrefix,
  addPagePrefix = false,
  urlID = '',
}: PaginationTypes) => {
  const paginationCount = useMemo(() => {
    return Math.ceil(numberOfElements / elementsDivider);
  }, [numberOfElements, elementsDivider]);

  const buttons = useMemo(() => {
    const arr = [];
    for (let i = 0; i < paginationCount; i++) {
      arr.push(i + 1);
    }
    return arr;
  }, [paginationCount]);

  if (paginationCount < 2) {
    return null;
  }

  const firstPaginationNumber = (
    <Link
      className={`${styles.link}`}
      href={`${pathPrefix}${urlID}`}
    >
      {1}
    </Link>
  );

  const secondPaginationNumber = (
    <Link
      className={`${styles.link}`}
      href={addPagePrefix ? `${pathPrefix}/strona/2${urlID}` : `${pathPrefix}/2${urlID}`}
    >
      {2}
    </Link>
  );

  const preLastPaginationNumber = (
    <Link
      className={`${styles.link}`}
      href={`${pathPrefix}${addPagePrefix ? '/strona' : ''}/${paginationCount - 1}${urlID}`}
    >
      {paginationCount - 1}
    </Link>
  );

  const lastPaginationNumber = (
    <Link
      className={`${styles.link}`}
      href={`${pathPrefix}${addPagePrefix ? '/strona' : ''}/${paginationCount}${urlID}`}
    >
      {paginationCount}
    </Link>
  );

  const arrowLeft = (
    <Link
      className={selectedNumber == 1 ? `${styles.disabled} ${styles.arrow}` : `${styles.arrow}`}
      href={
        selectedNumber >= 3
          ? `${pathPrefix}${addPagePrefix ? '/strona' : ''}/${selectedNumber - 1}${urlID}`
          : `${pathPrefix}${urlID}`
      }
      tabIndex={selectedNumber == 1 ? -1 : 0}
    >
      <ArrowLeft />
    </Link>
  );

  const arrowRight = (
    <Link
      className={selectedNumber >= paginationCount ? `${styles.disabled} ${styles.arrow}` : `${styles.arrow}`}
      href={
        selectedNumber < paginationCount
          ? `${pathPrefix}${addPagePrefix ? '/strona' : ''}/${selectedNumber + 1}${urlID}`
          : `${pathPrefix}${addPagePrefix ? '/strona' : ''}/${paginationCount}${urlID}`
      }
      tabIndex={selectedNumber >= paginationCount ? -1 : 0}
    >
      <ArrowRight />
    </Link>
  );

  return (
    <div className={styles['Pagination']}>
      {arrowLeft}
      <div className={styles.center}>
        {paginationCount < 2 ? (
          <>
            {buttons.map((el, i) => (
              <Link
                className={selectedNumber === el ? `${styles.link} ${styles.active}` : `${styles.link}`}
                key={i}
                href={
                  el >= 2 ? `${pathPrefix}${addPagePrefix ? '/strona' : ''}/${el}${urlID}` : `${pathPrefix}${urlID}`
                }
                tabIndex={selectedNumber === el ? -1 : 0}
              >
                {el}
              </Link>
            ))}
          </>
        ) : (
          <>
            {selectedNumber == 3 && firstPaginationNumber}
            {selectedNumber > 3 && (
              <>
                {firstPaginationNumber}
                {secondPaginationNumber}
              </>
            )}
            {selectedNumber > 2 && <a className={`${styles.link} ${styles.not}`}>...</a>}

            {buttons.map((el, index) => {
              //first two pagination numbers
              if (selectedNumber == 1 && index == 1) {
                return (
                  <Link
                    className={selectedNumber === el ? `${styles.link} ${styles.active}` : `${styles.link}`}
                    key={index}
                    href={
                      el >= 2 ? `${pathPrefix}${addPagePrefix ? '/strona' : ''}/${el}${urlID}` : `${pathPrefix}${urlID}`
                    }
                  >
                    {el}
                  </Link>
                );
              }
              //logic for numbers between separators
              if (index >= selectedNumber - 2 && index <= selectedNumber) {
                return (
                  <Link
                    className={selectedNumber === el ? `${styles.link} ${styles.active}` : `${styles.link}`}
                    key={index}
                    href={
                      el >= 2 ? `${pathPrefix}${addPagePrefix ? '/strona' : ''}/${el}${urlID}` : `${pathPrefix}${urlID}`
                    }
                    tabIndex={selectedNumber === el ? -1 : 0}
                  >
                    {el}
                  </Link>
                );
              }
              return null;
            })}

            {paginationCount - selectedNumber == 2 && <a className={`${styles.not}`}>...</a>}
            {paginationCount - selectedNumber == 2 && lastPaginationNumber}

            {paginationCount - selectedNumber > 2 && <a className={`${styles.not}`}>...</a>}
            {paginationCount - selectedNumber > 2 && (
              <>
                {preLastPaginationNumber}
                {lastPaginationNumber}
              </>
            )}
          </>
        )}
      </div>
      {arrowRight}
    </div>
  );
};

export default Pagination;

function ArrowLeft() {
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

function ArrowRight() {
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
