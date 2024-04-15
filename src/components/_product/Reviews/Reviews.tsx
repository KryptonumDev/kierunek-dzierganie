import Card from '@/components/_global/Reviews/_Card';
import styles from './Reviews.module.scss';
import type { ReviewsTypes } from './Reviews.types';

const Reviews = ({ reviews }: ReviewsTypes) => {
  return (
    <section className={styles['Reviews']}>
      <h2>
        Co mówią o naszym kursie <strong>szydełkowania</strong>
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
