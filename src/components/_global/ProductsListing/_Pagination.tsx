'use client';
import { useMemo } from 'react';
import styles from './ProductsListing.module.scss';
import type { PaginationTypes } from './ProductsListing.types';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

const Pagination = ({ allElementsCount, elementsPerPage, basis }: PaginationTypes) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams.toString());
  const currentPage = Number(newParams.get('strona')) || 1;

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
    <button
      className={`${styles.link}`}
      onClick={() => handleButtonClick(1)}
    >
      {1}
    </button>
  );

  const secondPaginationNumber = (
    <button
      className={`${styles.link}`}
      onClick={() => handleButtonClick(2)}
    >
      {2}
    </button>
  );

  const preLastPaginationNumber = (
    <button
      className={`${styles.link}`}
      onClick={() => handleButtonClick(paginationCount - 1)}
    >
      {paginationCount - 1}
    </button>
  );

  const lastPaginationNumber = (
    <button
      className={`${styles.link}`}
      onClick={() => handleButtonClick(paginationCount)}
    >
      {paginationCount}
    </button>
  );

  const arrowLeft = (
    <button
      className={currentPage == 1 ? `${styles.disabled} ${styles.arrow}` : `${styles.arrow}`}
      onClick={() => handleButtonClick(currentPage - 1)}
      tabIndex={currentPage == 1 ? -1 : 0}
    >
      <ArrowLeftIcon />
    </button>
  );

  const arrowRight = (
    <button
      className={currentPage >= paginationCount ? `${styles.disabled} ${styles.arrow}` : `${styles.arrow}`}
      onClick={() => handleButtonClick(currentPage + 1)}
      tabIndex={currentPage >= paginationCount ? -1 : 0}
    >
      <ArrowRightIcon />
    </button>
  );

  const handleButtonClick = (page: number) => {
    if (!page) {
      toast.error('Poziom trudności źle skonfigurowany, proszę skontaktować się z obsługą sklepu', { icon: '❌' });
      return;
    }

    if (page <= 1) {
      newParams.delete('strona');
      router.push(`${basis}?${newParams.toString()}`, { scroll: false });
      return;
    }

    if (page > paginationCount) {
      newParams.set('strona', String(paginationCount));
      router.push(`${basis}?${newParams.toString()}`, { scroll: false });
      return;
    }

    newParams.set('strona', String(page));
    router.push(`${basis}?${newParams.toString()}`, { scroll: false });
  };

  return (
    <div className={styles['pagination']}>
      {arrowLeft}
      <div className={styles.center}>
        {paginationCount < 2 ? (
          <>
            {buttons.map((el, i) => (
              <button
                className={currentPage === el ? `${styles.link} ${styles.active}` : `${styles.link}`}
                key={i}
                tabIndex={currentPage === el ? -1 : 0}
                onClick={() => handleButtonClick(el)}
              >
                {el}
              </button>
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
                  <button
                    className={currentPage === el ? `${styles.link} ${styles.active}` : `${styles.link}`}
                    key={index}
                    onClick={() => handleButtonClick(el)}
                  >
                    {el}
                  </button>
                );
              }
              //logic for numbers between separators
              if (index >= currentPage - 4 && index <= currentPage && currentPage < 5) {
                return (
                  <button
                    className={currentPage === el ? `${styles.link} ${styles.active}` : `${styles.link}`}
                    key={index}
                    onClick={() => handleButtonClick(el)}
                    tabIndex={currentPage === el ? -1 : 0}
                  >
                    {el}
                  </button>
                );
              }
              if (index >= currentPage - 2 && index <= currentPage) {
                return (
                  <button
                    className={currentPage === el ? `${styles.link} ${styles.active}` : `${styles.link}`}
                    key={index}
                    onClick={() => handleButtonClick(el)}
                    tabIndex={currentPage === el ? -1 : 0}
                  >
                    {el}
                  </button>
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
