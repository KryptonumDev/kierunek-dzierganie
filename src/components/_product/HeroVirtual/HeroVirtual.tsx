'use client';
import { useEffect, useMemo } from 'react';
import styles from './HeroVirtual.module.scss';
import Gallery from '@/components/ui/Gallery';
import type { HeroVirtualTypes } from './HeroVirtual.types';
import type { ImgType } from '@/global/types';
import { formatPrice } from '@/utils/price-formatter';
import AddToCart from '@/components/ui/AddToCart';
import { Hearth, PayPo } from '@/components/ui/Icons';
import Img from '@/components/ui/image';
import Button from '@/components/ui/Button';

const gtag: Gtag.Gtag = function () {
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer?.push(arguments);
};

const HeroVirtual = ({ alreadyBought, course, previewLessons }: HeroVirtualTypes) => {
  const images = useMemo(() => {
    const images: Array<{ data: ImgType | string; type: 'video' | 'image' }> = [];
    // add video as first element if exists
    if (course?.featuredVideo) images.push({ type: 'video', data: course?.featuredVideo });
    course?.gallery!.forEach((el) => images.push({ type: 'image', data: el }));
    return images;
  }, [course]);

  useEffect(() => {
    gtag('event', 'view_item', {
      currency: 'PLN',
      value: course.discount ? course.discount / 100 : course.price! / 100,
      items: [
        {
          id: course._id,
          name: course.name,
          discount: course.discount ? (course.price! - course.discount) / 100 : null,
          price: course.price! / 100,
          item_category: course._type,
          item_category2: course.basis,
        },
      ],
    });
  }, [course]);

  return (
    <section className={styles['HeroVirtual']}>
      <Gallery images={images} />
      <div className={styles['info']}>
        {course.rating !== undefined && course.reviewsCount > 0 ? (
          <p className={styles['rating']}>
            <Hearth />{' '}
            <span>
              <b>{course.rating}</b>/5 ({course.reviewsCount})
            </span>
          </p>
        ) : (
          <p className={styles['rating']}>
            <Hearth /> <span>Brak opinii</span>
          </p>
        )}
        <h1>{course.name}</h1>
        <div className={styles['flex']}>
          <div className={styles['price']}>
            <p>
              <span className={course!.discount ? styles['discount'] : ''}>{formatPrice(course.price!)}</span>{' '}
              {course!.discount && <span>{formatPrice(course.discount)}</span>}
            </p>
            <small>Najniższa cena z 30 dni przed obniżką: {formatPrice(course.price!)}</small>
          </div>
        </div>
        <div className={styles['flex']}>
          {/* TODO: check is course already bought by user and show link to dashboard */}
          {alreadyBought ? (
            <Button href={`/moje-konto/kursy/${course.slug}`}>Przejdź do kursu</Button>
          ) : (
            <AddToCart id={course._id} />
          )}
          {!alreadyBought && previewLessons?.slug && (
            <a
              className='link'
              href={`./${course.slug}/${previewLessons.slug}`}
            >
              Obejrzyj pierwszy moduł za darmo
            </a>
          )}
        </div>
        <p className={styles['pay-po']}>
          Kup dzisiaj i zapłać za 30 dni z PayPo
          <PayPo />
        </p>
        <div className={styles['author']}>
          <Img
            sizes={'60px'}
            data={course.author.image}
          />
          <div>
            <p>
              Autorka {course.author.countOfCourse} {course.author.countOfCourse === 1 ? 'kursu' : 'kursów'}
            </p>
            <p>{course.author.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroVirtual;
