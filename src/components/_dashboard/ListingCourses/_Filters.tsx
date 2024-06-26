'use client';
import styles from './ListingCourses.module.scss';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { courseComplexityEnum } from '@/global/constants';
import type { Complexity } from '@/global/types';
import { FiltersTypes } from './ListingCourses.types';

export default function Filters({ categories, authors }: FiltersTypes) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams.toString());

  const [open, setOpen] = useState(!!searchParams.toString());

  const handleTypeClick = (slug: string) => {
    if (!slug) {
      newParams.delete('rodzaj');
      router.push(`/moje-konto/kursy?${newParams.toString()}`, { scroll: false });
      return;
    }

    newParams.set('rodzaj', slug);
    router.push(`/moje-konto/kursy?${newParams.toString()}`, { scroll: false });
  };

  const handleComplexityClick = (slug: string) => {
    if (!slug) {
      newParams.delete('poziom-trudnosci');
      router.push(`/moje-konto/kursy?${newParams.toString()}`, { scroll: false });
      return;
    }

    newParams.set('poziom-trudnosci', slug);
    router.push(`/moje-konto/kursy?${newParams.toString()}`, { scroll: false });
  };

  const handleAuthorClick = (slug: string) => {
    if (!slug) {
      newParams.delete('autor');
      router.push(`/moje-konto/kursy?${newParams.toString()}`, { scroll: false });
      return;
    }

    newParams.delete('strona');
    newParams.set('autor', slug);
    router.push(`/moje-konto/kursy?${newParams.toString()}`, { scroll: false });
  };

  const handleCategoryClick = (slug: string) => {
    if (!slug) {
      newParams.delete('kategoria');
      router.push(`/moje-konto/kursy?${newParams.toString()}`, { scroll: false });
      return;
    }

    newParams.set('kategoria', slug);
    router.push(`/moje-konto/kursy?${newParams.toString()}`, { scroll: false });
  };

  const handleRemoveFilters = () => {
    router.push('/moje-konto/kursy', { scroll: false });
  };

  return (
    <div
      id='listing'
      className={styles['filters']}
    >
      <div className={styles['filters-button-wrap']}>
        <button
          className={styles['filters-button']}
          data-open={open}
          onClick={() => setOpen(!open)}
        >
          Filtry <Chevron />
        </button>
      </div>
      <div
        data-open={open}
        className={styles['filters-grid']}
      >
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
      {searchParams.toString() &&
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
