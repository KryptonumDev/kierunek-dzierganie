'use client';
import Card from '@/components/_global/Reviews/_Card';
import styles from './Reviews.module.scss';
import type { ReviewsTypes } from './Reviews.types';
import Button from '@/components/ui/Button';
import { useState, useEffect } from 'react';
import AddReview from '@/components/_global/AddReview';
import { getProductUserData } from '@/utils/user-actions';

const Reviews = ({ user: initialUser, alreadyBought, reviews, course, product }: ReviewsTypes) => {
  // Fetch user data client-side if not provided (allows static page rendering)
  const [user, setUser] = useState(initialUser);
  useEffect(() => {
    if (initialUser === undefined) {
      getProductUserData().then((data) => {
        if (data.firstName) setUser(data.firstName);
      });
    }
  }, [initialUser]);

  const [addReview, setAddReview] = useState<null | boolean>(null);

  if (reviews.length === 0) {
    return (
      <section className={styles['Reviews-empty']}>
        <h2>
          Ten {course ? 'kurs' : 'produkt'} jeszcze <strong>nie ma</strong> opinii
        </h2>
        <p>Twoja może być tą pierwszą! Dodaj opinię, aby pomóc innym zdecydować, czy to coś dla nich</p>
        {user ? (
          <>
            {!course || alreadyBought ? (
              <Button onClick={() => setAddReview(true)}>Dodaj opinię</Button>
            ) : (
              <p>Kup ten kurs żeby zostawić opinię</p>
            )}
          </>
        ) : (
          <Button href='/moje-konto/autoryzacja'>Zaloguj się, aby dodać opinię</Button>
        )}
        {user && (
          <AddReview
            open={!!addReview}
            setOpen={setAddReview}
            user={user}
            product={product}
          />
        )}
      </section>
    );
  }

  return (
    <section className={styles['Reviews']}>
      <h2>
        Co mówią o naszym <strong>{course ? 'kursie' : 'produkcie'}</strong>
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
      {user ? (
        <>{!course || alreadyBought ? <Button onClick={() => setAddReview(true)}>Dodaj opinię</Button> : null}</>
      ) : (
        <Button href='/moje-konto/autoryzacja'>Zaloguj się, aby dodać opinię</Button>
      )}
      {user && (
        <AddReview
          open={!!addReview}
          setOpen={setAddReview}
          user={user}
          product={product}
        />
      )}
    </section>
  );
};

export default Reviews;
