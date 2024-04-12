'use client';
import toast from 'react-hot-toast';
import styles from './ProductsListing.module.scss';
import type { FiltersTypes } from './ProductsListing.types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Checkbox from '@/components/ui/Checkbox';

export default function Filters({ basis, categories }: FiltersTypes) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams.toString());

  const [open, setOpen] = useState(!!searchParams.toString());

  const handleCategoryClick = (slug: string) => {
    if (!slug) {
      toast.error('Kategoria źle skonfigurowana, proszę skontaktować się z obsługą sklepu', { icon: '❌' });
      return;
    }

    newParams.set('kategoria', slug);
    router.push(`${basis}?${newParams.toString()}`);
  };

  const handleBundleClick = (checked: boolean) => {
    if (newParams.get('bundle')) {
      newParams.delete('bundle');
    } else if (!checked) {
      // skip if unchecked but param doesn't exist
    } else {
      newParams.set('bundle', String(checked));
    }

    router.push(`${basis}?${newParams.toString()}`);
  };

  const handleDiscountedClick = (checked: boolean) => {
    if (newParams.get('discounted')) {
      newParams.delete('discounted');
    } else if (!checked) {
      // skip if unchecked but param doesn't exist
    } else {
      newParams.set('discounted', String(checked));
    }

    router.push(`${basis}?${newParams.toString()}`);
  };

  const handleComplexityClick = (slug: string) => {
    if (!slug) {
      toast.error('Poziom trudności źle skonfigurowany, proszę skontaktować się z obsługą sklepu', { icon: '❌' });
      return;
    }

    newParams.set('poziom-trudnosci', slug);
    router.push(`${basis}?${newParams.toString()}`);
  };

  return (
    <div className={styles['filters']}>
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
        <div>
          <h3>Poziom trudności</h3>
          <button onClick={() => handleComplexityClick('1')}>Dla początkujących</button>
          <button onClick={() => handleComplexityClick('2')}>Dla średnio zaawansowanych</button>
          <button onClick={() => handleComplexityClick('3')}>Dla zaawansowanych</button>
        </div>
      </div>
      <div
        data-open={open}
        className={styles['checkboxes']}
      >
        <Checkbox
          // TODO: button prev page in browser not working after clicking, checkbox not setting to false
          defaultChecked={!!searchParams.get('bundle')}
          onChange={(e) => handleBundleClick(e.target.checked)}
          label='Pakiet'
          register={{
            name: 'bundle',
          }}
        />
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
