'use client';
import { courseComplexityEnum } from '@/global/constants';
import type { Complexity } from '@/global/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import styles from './ListingCourses.module.scss';
import { FiltersTypes } from './ListingCourses.types';

export default function FiltersSorting({ categories, authors, sort }: FiltersTypes) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams.toString());
  const currentFilters = ['rodzaj', 'poziom-trudnosci', 'autor', 'kategoria'];

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) params.delete(name);
      else params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const [isFiltersOpen, setIsFiltersOpen] = useState(currentFilters.some((filter) => searchParams.get(filter)));
  const [isSortingOpen, setIsSortingOpen] = useState(false);

  const handleTypeClick = (slug: string) => {
    if (!slug) {
      router.push(`/moje-konto/kursy?${createQueryString('rodzaj', null)}`, { scroll: false });
      return;
    }

    router.push(`/moje-konto/kursy?${createQueryString('rodzaj', slug)}`, { scroll: false });
  };

  const handleComplexityClick = (slug: string) => {
    if (!slug) {
      router.push(`/moje-konto/kursy?${createQueryString('poziom-trudnosci', null)}`, { scroll: false });
      return;
    }

    router.push(`/moje-konto/kursy?${createQueryString('poziom-trudnosci', slug)}`, { scroll: false });
  };

  const handleAuthorClick = (slug: string) => {
    if (!slug) {
      router.push(`/moje-konto/kursy?${createQueryString('autor', null)}`, { scroll: false });
      return;
    }

    newParams.delete('strona');
    router.push(`/moje-konto/kursy?${createQueryString('autor', slug)}`, { scroll: false });
  };

  const handleCategoryClick = (slug: string) => {
    if (!slug) {
      router.push(`/moje-konto/kursy?${createQueryString('kategoria', null)}`, { scroll: false });
      return;
    }

    router.push(`/moje-konto/kursy?${createQueryString('kategoria', slug)}`, { scroll: false });
  };

  const handleSortClick = (slug: string) => {
    router.push(`/moje-konto/kursy?${createQueryString('sortowanie', slug)}`, { scroll: false });
  };

  const handleRemoveFilters = () => {
    setIsFiltersOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    currentFilters.forEach((filter) => params.delete(filter));
    router.push(`/moje-konto/kursy?${params.toString()}`, { scroll: false });
  };

  return (
    <div
      id='listing'
      className={styles['filters']}
    >
      <div className={styles['filters-button-wrap']}>
        <button
          className={styles['filters-button']}
          data-open={isSortingOpen}
          onClick={() => {
            setIsSortingOpen(!isSortingOpen);
            setIsFiltersOpen(false);
          }}
        >
          Sortowanie ({sort === 'ostatnio-przerabiane' ? 'Ostatnio przerabiane' : 'Najnowsze'}) <Chevron />
        </button>
        <button
          className={styles['filters-button']}
          data-open={isFiltersOpen}
          onClick={() => {
            setIsFiltersOpen(!isFiltersOpen);
            setIsSortingOpen(false);
          }}
        >
          Filtry <Chevron />
        </button>
      </div>
      {isFiltersOpen ? (
        <div className={styles['filters-grid']}>
          <div>
            <h3>Kategorie</h3>
            <button
              data-active={'crocheting' === searchParams.get('typ')}
              onClick={() => handleCategoryClick('crocheting')}
            >
              Szydełkowanie
            </button>
            <button
              data-active={'knitting' === searchParams.get('typ')}
              onClick={() => handleCategoryClick('knitting')}
            >
              Dzierganie
            </button>
          </div>
          <div>
            <h3>Rodzaj produktu</h3>
            {categories.map((category) => (
              <button
                data-active={category.slug === searchParams.get('rodzaj')}
                key={category._id}
                onClick={() => handleTypeClick(category.slug)}
              >
                {category.name}
              </button>
            ))}
          </div>
          <div>
            <h3>Poziom trudności</h3>
            <button
              data-active={searchParams.get('poziom-trudnosci') === 'dla-poczatkujacych'}
              onClick={() => handleComplexityClick('dla-poczatkujacych')}
            >
              Początkujący
            </button>
            <button
              data-active={searchParams.get('poziom-trudnosci') === 'dla-srednio-zaawansowanych'}
              onClick={() => handleComplexityClick('dla-srednio-zaawansowanych')}
            >
              Średnio zaawansowany
            </button>
            <button
              data-active={searchParams.get('poziom-trudnosci') === 'dla-zaawansowanych'}
              onClick={() => handleComplexityClick('dla-zaawansowanych')}
            >
              Zaawansowany
            </button>
          </div>
          <div>
            <h3>Twórca</h3>
            {authors!.map((author) => (
              <button
                data-active={author.slug === searchParams.get('autor')}
                key={author._id}
                onClick={() => handleAuthorClick(author.slug)}
              >
                {author.name}
              </button>
            ))}
          </div>
        </div>
      ) : isSortingOpen ? (
        <div className={styles['sorting-grid']}>
          <button
            disabled={sort !== 'ostatnio-przerabiane'}
            className={styles['sorting-button']}
            data-active={sort !== 'ostatnio-przerabiane'}
            onClick={() => handleSortClick('najnowsze')}
          >
            Najnowsze
          </button>
          <button
            disabled={sort === 'ostatnio-przerabiane'}
            className={styles['sorting-button']}
            data-active={sort === 'ostatnio-przerabiane'}
            onClick={() => handleSortClick('ostatnio-przerabiane')}
          >
            Ostatnio przerabiane
          </button>
        </div>
      ) : null}
      {searchParams.toString() &&
        currentFilters.some((filter) => searchParams.get(filter)) &&
        isFiltersOpen &&
        (!searchParams.toString().includes('strona') || searchParams.toString().includes('&')) && (
          <div className={styles['active-filters']}>
            <div>
              <p>Aktywne filtry:</p>
              {searchParams.get('kategoria') && (
                <button onClick={() => handleCategoryClick('')}>
                  Kategoria: {searchParams.get('kategoria') === 'crocheting' ? 'Szydełkowanie' : 'Dzierganie'}
                  <CrossIcon />
                </button>
              )}
              {searchParams.get('rodzaj') && (
                <button onClick={() => handleTypeClick('')}>
                  Rodzaj: {categories.find((category) => category.slug === searchParams.get('rodzaj'))?.name}
                  <CrossIcon />
                </button>
              )}
              {searchParams.get('poziom-trudnosci') && (
                <button onClick={() => handleComplexityClick('')}>
                  Poziom trudności: {courseComplexityEnum[searchParams.get('poziom-trudnosci') as Complexity]?.name}
                  <CrossIcon />
                </button>
              )}
              {searchParams.get('autor') && (
                <button onClick={() => handleAuthorClick('')}>
                  Twórca: {authors!.find((author) => author.slug === searchParams.get('autor'))?.name}
                  <CrossIcon />
                </button>
              )}
            </div>
            <button
              onClick={handleRemoveFilters}
              className='link'
            >
              Usuń filtry
            </button>
          </div>
        )}
    </div>
  );
}

const Chevron = () => (
  <svg
    width='24'
    height='25'
    viewBox='0 0 24 25'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M5.25 15.8607L12 9.11072L18.75 15.8607'
      stroke='#9A827A'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const CrossIcon = () => (
  <svg
    width='24'
    height='25'
    viewBox='0 0 24 25'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M17.25 17.5171L6.75 7.01709M17.25 7.01709L6.75 17.5171'
      stroke='#9A827A'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);
