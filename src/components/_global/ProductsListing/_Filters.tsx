'use client';
import styles from './ProductsListing.module.scss';
import type { FiltersTypes } from './ProductsListing.types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Checkbox from '@/components/ui/Checkbox';

export default function Filters({ basis, categories, courses, authors }: FiltersTypes) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams.toString());

  const [open, setOpen] = useState(!!searchParams.toString());

  const handleCategoryClick = (slug: string) => {
    if (!slug) {
      newParams.delete('strona');
      newParams.delete('kategoria');
      router.push(`${basis}?${newParams.toString()}`);
      return;
    }

    newParams.delete('strona');
    newParams.set('kategoria', slug);
    router.push(`${basis}?${newParams.toString()}`);
  };

  const handleComplexityClick = (slug: string) => {
    if (!slug) {
      newParams.delete('strona');
      newParams.delete('poziom-trudnosci');
      router.push(`${basis}?${newParams.toString()}`);
      return;
    }

    newParams.delete('strona');
    newParams.set('poziom-trudnosci', slug);
    router.push(`${basis}?${newParams.toString()}`);
  };

  const handleAuthorClick = (slug: string) => {
    if (!slug) {
      newParams.delete('strona');
      newParams.delete('autor');
      router.push(`${basis}?${newParams.toString()}`);
      return;
    }

    newParams.delete('strona');
    newParams.set('autor', slug);
    router.push(`${basis}?${newParams.toString()}`);
  };

  const handleBundleClick = (checked: boolean) => {
    if (newParams.get('bundle')) {
      newParams.delete('bundle');
    }

    if (checked) {
      newParams.set('bundle', String(checked));
    }

    newParams.delete('strona');
    router.push(`${basis}?${newParams.toString()}`);
  };

  const handleDiscountedClick = (checked: boolean) => {
    if (newParams.get('discounted')) {
      newParams.delete('discounted');
    }

    if (checked) {
      newParams.set('discounted', String(checked));
    }

    newParams.delete('strona');
    router.push(`${basis}?${newParams.toString()}`);
  };

  const handleRemoveFilters = () => {
    router.push(basis);
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
              data-active={category.slug === searchParams.get('kategoria')}
              key={category._id}
              onClick={() => handleCategoryClick(category.slug)}
            >
              {category.name}
            </button>
          ))}
        </div>
        {courses && (
          <div>
            <h3>Poziom trudności</h3>
            <button
              data-active={searchParams.get('poziom-trudnosci') === '1'}
              onClick={() => handleComplexityClick('1')}
            >
              Dla początkujących
            </button>
            <button
              data-active={searchParams.get('poziom-trudnosci') === '2'}
              onClick={() => handleComplexityClick('2')}
            >
              Dla średnio zaawansowanych
            </button>
            <button
              data-active={searchParams.get('poziom-trudnosci') === '3'}
              onClick={() => handleComplexityClick('3')}
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
            // TODO: button prev page in browser not working after clicking, checkbox not setting to false
            defaultChecked={!!searchParams.get('bundle')}
            onChange={(e) => handleBundleClick(e.target.checked)}
            label='Pakiet'
            register={{
              name: 'bundle',
            }}
          />
        )}
        <Checkbox
          // TODO: button prev page in browser not working after clicking, checkbox not setting to false
          defaultChecked={!!searchParams.get('discounted')}
          onChange={(e) => handleDiscountedClick(e.target.checked)}
          label='W promocji'
          register={{
            name: 'discounted',
          }}
        />
      </div>
      {newParams.toString() && (
        <div className={styles['active-filters']}>
          <div>
            <p>Aktywne filtry:</p>
            {searchParams.get('kategoria') && (
              <button onClick={() => handleCategoryClick('')}>
                Kategoria: {categories.find((category) => category.slug === searchParams.get('kategoria'))?.name}
                <CrossIcon />
              </button>
            )}
            {searchParams.get('poziom-trudnosci') && (
              <button onClick={() => handleComplexityClick('')}>
                Poziom trudności:{' '}
                {
                  ['Dla początkujących', 'Dla średnio zaawansowanych', 'Dla zaawansowanych'][
                    Number(searchParams.get('poziom-trudnosci')) - 1
                  ]
                }
                <CrossIcon />
              </button>
            )}
            {searchParams.get('autor') && (
              <button onClick={() => handleAuthorClick('')}>
                Twórca: {authors!.find((author) => author.slug === searchParams.get('autor'))?.name}
                <CrossIcon />
              </button>
            )}
            {searchParams.get('bundle') && (
              <button onClick={() => handleBundleClick(false)}>
                Tylko pakiety
                <CrossIcon />
              </button>
            )}
            {searchParams.get('discounted') && (
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
