'use client';
import styles from './ProductsListing.module.scss';
import type { FiltersTypes } from './ProductsListing.types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Checkbox from '@/components/ui/Checkbox';
import { courseComplexityEnum } from '@/global/constants';
import type { Complexity } from '@/global/types';

export default function Filters({ basis, categories, courses, authors }: FiltersTypes) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams.toString());

  const [open, setOpen] = useState(!!searchParams.toString());
  const [discount, setDiscount] = useState(searchParams.get('promocja') === 'true');
  const [bundle, setBundle] = useState(searchParams.get('pakiet') === 'true');

  useEffect(() => {
    setDiscount(searchParams.get('promocja') === 'true');
    setBundle(searchParams.get('pakiet') === 'true');
  }, [searchParams]);

  const handleTypeClick = (slug: string) => {
    if (!slug) {
      newParams.delete('strona');
      newParams.delete('rodzaj');
      router.push(`${basis}?${newParams.toString()}`, { scroll: false });
      return;
    }

    newParams.delete('strona');
    newParams.set('rodzaj', slug);
    router.push(`${basis}?${newParams.toString()}`, { scroll: false });
  };

  const handleComplexityClick = (slug: string) => {
    if (!slug) {
      newParams.delete('strona');
      newParams.delete('poziom-trudnosci');
      router.push(`${basis}?${newParams.toString()}`, { scroll: false });
      return;
    }

    newParams.delete('strona');
    newParams.set('poziom-trudnosci', slug);
    router.push(`${basis}?${newParams.toString()}`, { scroll: false });
  };

  const handleAuthorClick = (slug: string) => {
    if (!slug) {
      newParams.delete('strona');
      newParams.delete('autor');
      router.push(`${basis}?${newParams.toString()}`, { scroll: false });
      return;
    }

    newParams.delete('strona');
    newParams.set('autor', slug);
    router.push(`${basis}?${newParams.toString()}`, { scroll: false });
  };

  const handleBundleClick = (checked: boolean) => {
    if (newParams.get('pakiet')) {
      newParams.delete('pakiet');
    }

    if (checked) {
      newParams.set('pakiet', String(checked));
    }

    newParams.delete('strona');
    router.push(`${basis}?${newParams.toString()}`, { scroll: false });
  };

  const handleDiscountedClick = (checked: boolean) => {
    if (newParams.get('promocja')) {
      newParams.delete('promocja');
    }

    if (checked) {
      newParams.set('promocja', String(checked));
    }

    newParams.delete('strona');
    router.push(`${basis}?${newParams.toString()}`, { scroll: false });
  };

  const handleRemoveFilters = () => {
    router.push(basis, { scroll: false });
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
        {courses && (
          <div>
            <h3>Poziom trudności</h3>
            <button
              data-active={searchParams.get('poziom-trudnosci') === 'dla-poczatkujacych'}
              onClick={() => handleComplexityClick('dla-poczatkujacych')}
            >
              Dla początkujących
            </button>
            <button
              data-active={searchParams.get('poziom-trudnosci') === 'dla-srednio-zaawansowanych'}
              onClick={() => handleComplexityClick('dla-srednio-zaawansowanych')}
            >
              Dla średnio zaawansowanych
            </button>
            <button
              data-active={searchParams.get('poziom-trudnosci') === 'dla-zaawansowanych'}
              onClick={() => handleComplexityClick('dla-zaawansowanych')}
            >
              Dla zaawansowanych
            </button>
          </div>
        )}
        {authors && (
          <div>
            <h3>Twórca</h3>
            {authors.map((author) => (
              <button
                data-active={author.slug === searchParams.get('autor')}
                key={author._id}
                onClick={() => handleAuthorClick(author.slug)}
              >
                {author.name}
              </button>
            ))}
          </div>
        )}
      </div>
      <div
        data-open={open}
        className={styles['checkboxes']}
      >
        {courses && (
          <Checkbox
            checked={bundle}
            onChange={(e) => {
              setBundle(e.currentTarget.checked);
              handleBundleClick(e.target.checked);
            }}
            label='Pakiet'
            register={{
              name: 'bundle',
            }}
          />
        )}
        <Checkbox
          checked={discount}
          onChange={(e) => {
            setDiscount(e.currentTarget.checked);
            handleDiscountedClick(e.target.checked);
          }}
          label='W promocji'
          register={{
            name: 'discounted',
          }}
        />
      </div>
      {searchParams.toString() &&
        (!searchParams.toString().includes('strona') || searchParams.toString().includes('&')) 
        && (
          <div className={styles['active-filters']}>
            <div>
              <p>Aktywne filtry:</p>
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
              {searchParams.get('pakiet') && (
                <button onClick={() => handleBundleClick(false)}>
                  Tylko pakiety
                  <CrossIcon />
                </button>
              )}
              {searchParams.get('promocja') && (
                <button onClick={() => handleDiscountedClick(false)}>
                  Tylko promocje
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
