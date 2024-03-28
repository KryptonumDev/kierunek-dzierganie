import { useMemo } from 'react';
import styles from './Pagination.module.scss';
import type { PaginationTypes } from './Pagination.types';
import Link from 'next/link';

const Pagination = ({
  currentPage = 1,
  allElementsCount,
  elementsPerPage,
  pathPrefix,
  scrollTo = '',
}: PaginationTypes) => {
  const paginationCount = useMemo(() => {
    return Math.ceil(allElementsCount / elementsPerPage);
  }, [allElementsCount, elementsPerPage]);

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
      href={`${pathPrefix.replace('/strona', '')}${scrollTo}`}
    >
      {1}
    </Link>
  );

  const secondPaginationNumber = (
    <Link
      className={`${styles.link}`}
      href={`${pathPrefix}/2${scrollTo}`}
    >
      {2}
    </Link>
  );

  const preLastPaginationNumber = (
    <Link
      className={`${styles.link}`}
      href={`${pathPrefix}/${paginationCount - 1}${scrollTo}`}
    >
      {paginationCount - 1}
    </Link>
  );

  const lastPaginationNumber = (
    <Link
      className={`${styles.link}`}
      href={`${pathPrefix}/${paginationCount}${scrollTo}`}
    >
      {paginationCount}
    </Link>
  );

  const arrowLeft = (
    <Link
      className={currentPage == 1 ? `${styles.disabled} ${styles.arrow}` : `${styles.arrow}`}
      href={
        currentPage >= 3
          ? `${pathPrefix}/${currentPage - 1}${scrollTo}`
          : `${pathPrefix.replace('/strona', '')}${scrollTo}`
      }
      tabIndex={currentPage == 1 ? -1 : 0}
    >
      <ArrowLeftIcon />
    </Link>
  );

  const arrowRight = (
    <Link
      className={currentPage >= paginationCount ? `${styles.disabled} ${styles.arrow}` : `${styles.arrow}`}
      href={
        currentPage < paginationCount
          ? `${pathPrefix}/${currentPage + 1}${scrollTo}`
          : `${pathPrefix}/${paginationCount}${scrollTo}`
      }
      tabIndex={currentPage >= paginationCount ? -1 : 0}
    >
      <ArrowRightIcon />
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
                className={currentPage === el ? `${styles.link} ${styles.active}` : `${styles.link}`}
                key={i}
                href={el >= 2 ? `${pathPrefix}/${el}${scrollTo}` : `${pathPrefix.replace('/strona', '')}${scrollTo}`}
                tabIndex={currentPage === el ? -1 : 0}
              >
                {el}
              </Link>
            ))}
          </>
        ) : (
          <>
            {currentPage > 4 && (
              <>
                {firstPaginationNumber}
                {secondPaginationNumber}
              </>
            )}
            {currentPage > 4 && <div className={`${styles.link} ${styles.not}`}>...</div>}

            {buttons.map((el, index) => {
              //first two pagination numbers
              if (currentPage == 1 && index == 1) {
                return (
                  <Link
                    className={currentPage === el ? `${styles.link} ${styles.active}` : `${styles.link}`}
                    key={index}
                    href={
                      el >= 2 ? `${pathPrefix}/${el}${scrollTo}` : `${pathPrefix.replace('/strona', '')}${scrollTo}`
                    }
                  >
                    {el}
                  </Link>
                );
              }
              //logic for numbers between separators
              if (index >= currentPage - 4 && index <= currentPage && currentPage < 5) {
                return (
                  <Link
                    className={currentPage === el ? `${styles.link} ${styles.active}` : `${styles.link}`}
                    key={index}
                    href={el >= 2 ? `${pathPrefix}/${el}${scrollTo}` : `${pathPrefix.replace('/strona', '')}${scrollTo}`}
                    tabIndex={currentPage === el ? -1 : 0}
                  >
                    {el}
                  </Link>
                );
              }
              if (index >= currentPage - 2 && index <= currentPage) {
                return (
                  <Link
                    className={currentPage === el ? `${styles.link} ${styles.active}` : `${styles.link}`}
                    key={index}
                    href={el >= 2 ? `${pathPrefix}/${el}${scrollTo}` : `${pathPrefix}${scrollTo}`}
                    tabIndex={currentPage === el ? -1 : 0}
                  >
                    {el}
                  </Link>
                );
              }
              return null;
            })}

            {paginationCount - currentPage == 3 && <div className={`${styles.not}`}>...</div>}
            {paginationCount - currentPage == 3 && lastPaginationNumber}

            {paginationCount - currentPage > 3 && <div className={`${styles.not}`}>...</div>}
            {paginationCount - currentPage > 3 && (
              <>
                {preLastPaginationNumber}
                {lastPaginationNumber}
              </>
            )}
            {paginationCount - currentPage == 2 && lastPaginationNumber}
          </>
        )}
      </div>
      {arrowRight}
    </div>
  );
};

export default Pagination;

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
