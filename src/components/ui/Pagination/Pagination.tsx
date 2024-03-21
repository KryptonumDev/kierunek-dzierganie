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
        {paginationCount < 2 ? (
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
            {selectedNumber > 2 && selectedNumber < 4 && (
              <Link
                className={`${styles.link}`}
                href={`${pathPrefix}${urlID}`}
              >
                {1}
              </Link>
            )}
            {selectedNumber > 3 && (
              <>
                <Link
                  className={`${styles.link}`}
                  href={`${pathPrefix}${urlID}`}
                >
                  {1}
                </Link>
                <Link
                  className={`${styles.link}`}
                  href={`${pathPrefix}${urlID}`}
                >
                  {2}
                </Link>
              </>
            )}
            {selectedNumber > 2 && <a className={`${styles.link} ${styles.not}`}>...</a>}

            {buttons.map((el, index) => {
              if (selectedNumber < 1 && index < 1) {
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
              if (selectedNumber > 1 && index > paginationCount) {
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
              if (index >= selectedNumber - 2 && index <= selectedNumber) {
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

            {paginationCount - selectedNumber == 2 && <a className={`${styles.not}`}>...</a>}
            {paginationCount - selectedNumber == 2 && (
              <>
                <Link
                  className={`${styles.link}`}
                  href={`${pathPrefix}${isCategoryPagination ? '' : '/strona'}/${paginationCount}${urlID}`}
                >
                  {paginationCount}
                </Link>
              </>
            )}

            {(paginationCount - selectedNumber > 2) && <a className={`${styles.not}`}>...</a>}
            {(paginationCount - selectedNumber > 2) && (
              <>
                <Link
                  className={`${styles.link}`}
                  href={`${pathPrefix}${isCategoryPagination ? '' : '/strona'}/${paginationCount}${urlID}`}
                >
                  {paginationCount - 1}
                </Link>
                <Link
                  className={`${styles.link}`}
                  href={`${pathPrefix}${isCategoryPagination ? '' : '/strona'}/${paginationCount}${urlID}`}
                >
                  {paginationCount}
                </Link>
              </>
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
