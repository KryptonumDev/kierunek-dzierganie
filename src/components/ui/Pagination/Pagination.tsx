import { useMemo } from 'react';
import styles from './Pagination.module.scss';
import type { PaginationTypes } from './Pagination.types';
import Link from 'next/link';

const Pagination = ({
  selectedNumber = 1,
  numberOfElements,
  elementsDivider,
  pathPrefix,
  isCategoryPagination,
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

  return (
    <div className={styles['Pagination']}>
      <Link
        className={selectedNumber == 1 ? `${styles.disabled} ${styles.link}` : `${styles.arrow} ${styles.link}`}
        href={
          selectedNumber >= 3
            ? `${pathPrefix}${isCategoryPagination ? '' : '/strona'}/${selectedNumber - 1}${urlID}`
            : `${pathPrefix}${urlID}`
        }
      >
        <ArrowLeft />
      </Link>
      <div className={styles.center}>
        {paginationCount < 6 ? (
          <>
            {buttons.map((el, i) => (
              <Link
                className={selectedNumber === el ? `${styles.link} ${styles.active}` : `${styles.link}`}
                key={i}
                href={
                  el >= 2
                    ? `${pathPrefix}${isCategoryPagination ? '' : '/strona'}/${el}${urlID}`
                    : `${pathPrefix}${urlID}`
                }
              >
                {el}
              </Link>
            ))}
          </>
        ) : (
          <>
            {selectedNumber > 3 && (
              <Link
                className={`${styles.link}`}
                href={`${pathPrefix}${urlID}`}
              >
                {1}
              </Link>
            )}
            {selectedNumber > 4 && <a className={`${styles.link} ${styles.not}`}>...</a>}

            {buttons.map((el, index) => {
              if (selectedNumber < 4 && index < 6) {
                // first 4 pages
                return (
                  <Link
                    className={selectedNumber === el ? `${styles.link} ${styles.active}` : `${styles.link}`}
                    key={index}
                    href={
                      el >= 2
                        ? `${pathPrefix}${isCategoryPagination ? '' : '/strona'}/${el}${urlID}`
                        : `${pathPrefix}${urlID}`
                    }
                  >
                    {el}
                  </Link>
                );
              }
              if (selectedNumber > paginationCount - 3 && index > paginationCount - 7) {
                // last 4 pages
                return (
                  <Link
                    className={selectedNumber === el ? `${styles.link} ${styles.active}` : `${styles.link}`}
                    key={index}
                    href={`${pathPrefix}${isCategoryPagination ? '' : '/strona'}/${el}${urlID}`}
                  >
                    {el}
                  </Link>
                );
              }
              if (index >= selectedNumber - 3 && index <= selectedNumber + 1) {
                // all othher pages
                return (
                  <Link
                    className={selectedNumber === el ? `${styles.link} ${styles.active}` : `${styles.link}`}
                    key={index}
                    href={`${pathPrefix}${isCategoryPagination ? '' : '/strona'}/${el}${urlID}`}
                  >
                    {el}
                  </Link>
                );
              }
              return null;
            })}

            {(selectedNumber === 1 || paginationCount - selectedNumber > 3) && <a className={`${styles.not}`}>...</a>}
            {(selectedNumber === 1 || paginationCount - selectedNumber > 2) && (
              <Link
                className={`${styles.link}`}
                href={`${pathPrefix}${isCategoryPagination ? '' : '/strona'}/${paginationCount}${urlID}`}
              >
                {paginationCount}
              </Link>
            )}
          </>
        )}
      </div>
      <Link
        className={
          selectedNumber >= paginationCount ? `${styles.disabled} ${styles.link}` : `${styles.link} ${styles.arrow}`
        }
        href={
          selectedNumber < paginationCount
            ? `${pathPrefix}${isCategoryPagination ? '' : '/strona'}/${selectedNumber + 1}${urlID}`
            : `${pathPrefix}${isCategoryPagination ? '' : '/strona'}/${paginationCount}${urlID}`
        }
      >
        <ArrowRight />
      </Link>
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
