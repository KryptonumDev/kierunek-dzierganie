import type { CourseAccessMode, ProductCard } from '@/global/types';

type SellableCourseLike = {
  accessMode?: CourseAccessMode | null;
  accessFixedDate?: string | null;
};

type SellableProductLike = {
  _type?: ProductCard['_type'];
  courses?: SellableCourseLike[] | null;
} & SellableCourseLike;

export function getTodayInWarsawDateString(referenceDate = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Warsaw',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const formattedParts = formatter.formatToParts(referenceDate).reduce<Record<string, string>>((acc, part) => {
    if (part.type !== 'literal') acc[part.type] = part.value;
    return acc;
  }, {});

  return `${formattedParts.year}-${formattedParts.month}-${formattedParts.day}`;
}

export function isFixedDateCourseExpired(
  course: SellableCourseLike | null | undefined,
  todayWarsaw = getTodayInWarsawDateString()
) {
  return course?.accessMode === 'fixed_date' && !!course.accessFixedDate && course.accessFixedDate < todayWarsaw;
}

export function isStorefrontProductAvailable(
  product: SellableProductLike | null | undefined,
  todayWarsaw = getTodayInWarsawDateString()
) {
  if (!product) return false;

  if (product._type === 'bundle') {
    return !product.courses?.some((course) => isFixedDateCourseExpired(course, todayWarsaw));
  }

  if (product._type === 'course') {
    return !isFixedDateCourseExpired(product, todayWarsaw);
  }

  return true;
}

export function filterAvailableStorefrontProducts<T extends SellableProductLike>(
  products: T[] | null | undefined,
  todayWarsaw = getTodayInWarsawDateString()
) {
  if (!products) return [];

  return products.filter((product) => isStorefrontProductAvailable(product, todayWarsaw));
}
