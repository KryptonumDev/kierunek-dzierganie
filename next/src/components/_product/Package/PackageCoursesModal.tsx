'use client';

import { useEffect, useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/ui/ProductCard';
import type { ProductCard as ProductCardType } from '@/global/types';
import styles from './Package.module.scss';

type Props = {
  courses: ProductCardType[];
  alwaysVisibleCount?: number;
};

const PackageCoursesModal = ({ courses, alwaysVisibleCount = 4 }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const hasHiddenCourses = courses.length > alwaysVisibleCount;
  const filteredCourses = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) return courses;
    return courses.filter((course) => course.name.toLowerCase().includes(query));
  }, [searchValue, courses]);

  useEffect(() => {
    if (!isModalOpen) return;


    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isModalOpen]);

  if (!hasHiddenCourses) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className={styles.showAll}
      >
        Pokaż wszystkie kursy
      </Button>

      {isModalOpen && (
        <div
          className={styles.modalOverlay}
          role='presentation'
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className={styles.modal}
            role='dialog'
            aria-modal='true'
            aria-label='Wszystkie kursy w pakiecie'
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>Wszystkie kursy w pakiecie ({courses.length})</h3>
              <button
                type='button'
                className={styles.closeButton}
                onClick={() => setIsModalOpen(false)}
                aria-label='Zamknij modal z kursami'
              >
                ✕
              </button>
            </div>

            <label className={styles.search}>
              <span>Szukaj kursu</span>
              <input
                type='search'
                placeholder='Wpisz nazwę kursu...'
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
              />
            </label>

            <div
              className={`${styles.modalList} ${filteredCourses.length === 0 ? styles.emptyState : ''}`}
            >
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course, index) => (
                  <ProductCard
                    desktopHorizontal={true}
                    key={`${course._id}-modal-${index}`}
                    data={course}
                  />
                ))
              ) : (
                <div className={styles.noResults}>
                  <p>Brak kursów pasujących do wyszukiwania.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PackageCoursesModal;
