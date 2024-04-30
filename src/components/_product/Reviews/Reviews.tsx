'use client';
import Card from '@/components/_global/Reviews/_Card';
import styles from './Reviews.module.scss';
import type { ReviewsTypes } from './Reviews.types';
import Button from '@/components/ui/Button';
import { useState } from 'react';
import AddReview from '@/components/_global/AddReview';

const Reviews = ({ logged, alreadyBought, reviews, course }: ReviewsTypes) => {
  const [addReview, setAddReview] = useState(false);

  if (reviews.length === 0) {
    return (
      <section className={styles['Reviews-empty']}>
        <h2>
          Ten {course ? 'kurs' : 'produkt'} jeszcze <strong>nie ma</strong> opinii
        </h2>
        <p>Twoja może być tą pierwszą! Dodaj opinię, aby pomóc innym zdecydować, czy to coś dla nich</p>
        {/* TODO: add check is already added comment */}
        {logged ? (
          <>
            {!course || alreadyBought ? (
              <Button onClick={() => setAddReview(true)}>Dodaj opinię</Button>
            ) : (
              <p>Kup ten produkt żeby zostawić opinię</p>
            )}
          </>
        ) : (
          <Button href='/moje-konto/autoryzacja'>Zaloguj się, aby dodać opinię</Button>
        )}
        <AddReview
          open={addReview}
          setOpen={setAddReview}
        />
      </section>
    );
  }

  return (
    <section className={styles['Reviews']}>
      <h2>
        Co mówią o naszym <strong>{course ? 'kurs' : 'produkt'}</strong>
      </h2>
      <div className={styles['grid']}>
        {reviews.map((review) => (
          <Card
            key={review._id}
            rating={review.rating}
            name={review.nameOfReviewer}
            review={review.review}
            images={undefined}
          />
        ))}
      </div>
      {/* TODO: add pagination */}
    </section>
  );
};

export default Reviews;
