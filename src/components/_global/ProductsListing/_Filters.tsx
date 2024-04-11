'use client';
import toast from 'react-hot-toast';
import styles from './ProductsListing.module.scss';
import type { FiltersTypes } from './ProductsListing.types';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Filters({ basis, categories }: FiltersTypes) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams.toString());

  const handleCategoryClick = (slug: string) => {
    if (!slug) {
      toast.error('Kategoria źle skonfigurowana, proszę skontaktować się z obsługą sklepu', { icon: '❌' });
      return;
    }
    newParams.set('category', slug);
    router.push(`${basis}?${newParams.toString()}`);
  };

  return (
    <div className={styles['filters']}>
      <button>
        Filtry i sortowanie <Chevron />
      </button>
      <div className={styles['filters-grid']}>
        <div>
          <h3>Rodzaj produktu</h3>
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => handleCategoryClick(category.slug)}
            >
              {category.name}
            </button>
          ))}
        </div>
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
