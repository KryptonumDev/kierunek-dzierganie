import type { BundleCourseShippingLink, CourseShippingMode, ProductCard } from '@/global/types';

export type ResolvedShippingInfo = {
  mode: CourseShippingMode;
  label: string | null;
};

export const SHIPPING_MODE_PRIORITY: Record<CourseShippingMode, number> = {
  none: 0,
  included: 1,
  paid: 2,
};

const normalizeShippingMode = (shippingMode?: CourseShippingMode | null): CourseShippingMode => {
  return shippingMode ?? 'none';
};

const normalizeShippingLabel = (shippingLabel?: string | null): string | null => {
  const trimmedLabel = shippingLabel?.trim();
  return trimmedLabel ? trimmedLabel : null;
};

const getHigherPriorityShippingMode = (
  left: CourseShippingMode,
  right: CourseShippingMode
): CourseShippingMode => {
  return SHIPPING_MODE_PRIORITY[left] >= SHIPPING_MODE_PRIORITY[right] ? left : right;
};

export const resolveBundleShippingMode = (courses?: BundleCourseShippingLink[] | null): CourseShippingMode => {
  if (!courses?.length) return 'none';

  return courses.reduce<CourseShippingMode>((resolvedMode, course) => {
    return getHigherPriorityShippingMode(resolvedMode, normalizeShippingMode(course.shippingMode));
  }, 'none');
};

export const resolveBundleShippingLabel = (
  courses?: BundleCourseShippingLink[] | null,
  resolvedMode?: CourseShippingMode
): string | null => {
  if (!courses?.length) return null;

  const effectiveMode = resolvedMode ?? resolveBundleShippingMode(courses);

  const matchingLabel = courses.find((course) => {
    return (
      normalizeShippingMode(course.shippingMode) === effectiveMode &&
      normalizeShippingLabel(course.shippingLabel) !== null
    );
  })?.shippingLabel;

  if (matchingLabel) {
    return normalizeShippingLabel(matchingLabel);
  }

  const firstShippableLabel = courses.find((course) => {
    return (
      normalizeShippingMode(course.shippingMode) !== 'none' &&
      normalizeShippingLabel(course.shippingLabel) !== null
    );
  })?.shippingLabel;

  return normalizeShippingLabel(firstShippableLabel);
};

type ShippingResolvableProductCard = Pick<
  ProductCard,
  '_type' | 'shippingMode' | 'shippingLabel' | 'courses' | 'voucherData'
>;

type ShippingResolvableProductCardCollection = ShippingResolvableProductCard[] | null | undefined;

export const resolveProductCardShippingMode = (
  item?: ShippingResolvableProductCard | null
): CourseShippingMode => {
  if (!item) return 'none';

  switch (item._type) {
    case 'product':
      return 'paid';
    case 'voucher':
      return item.voucherData?.type === 'PHYSICAL' ? 'paid' : 'none';
    case 'course':
      return normalizeShippingMode(item.shippingMode);
    case 'bundle':
      return resolveBundleShippingMode(item.courses);
    default:
      return 'none';
  }
};

export const resolveProductCardShippingLabel = (
  item?: ShippingResolvableProductCard | null
): string | null => {
  if (!item) return null;

  switch (item._type) {
    case 'course':
      return normalizeShippingLabel(item.shippingLabel);
    case 'bundle': {
      const resolvedMode = resolveProductCardShippingMode(item);
      return resolveBundleShippingLabel(item.courses, resolvedMode);
    }
    default:
      return null;
  }
};

export const resolveProductCardShippingInfo = (
  item?: ShippingResolvableProductCard | null
): ResolvedShippingInfo => {
  const mode = resolveProductCardShippingMode(item);

  return {
    mode,
    label: resolveProductCardShippingLabel(item),
  };
};

export const resolveProductCardsShippingMode = (
  items?: ShippingResolvableProductCardCollection
): CourseShippingMode => {
  if (!items?.length) return 'none';

  return items.reduce<CourseShippingMode>((resolvedMode, item) => {
    return getHigherPriorityShippingMode(resolvedMode, resolveProductCardShippingMode(item));
  }, 'none');
};

export const resolveProductCardsShippingLabel = (
  items?: ShippingResolvableProductCardCollection,
  resolvedMode?: CourseShippingMode
): string | null => {
  if (!items?.length) return null;

  const effectiveMode = resolvedMode ?? resolveProductCardsShippingMode(items);

  const matchingLabel = items.find((item) => {
    const shippingInfo = resolveProductCardShippingInfo(item);
    return shippingInfo.mode === effectiveMode && shippingInfo.label !== null;
  });

  if (matchingLabel) {
    return resolveProductCardShippingInfo(matchingLabel).label;
  }

  const firstShippableItem = items.find((item) => {
    return resolveProductCardShippingMode(item) !== 'none' && resolveProductCardShippingLabel(item) !== null;
  });

  return firstShippableItem ? resolveProductCardShippingLabel(firstShippableItem) : null;
};

export const resolveProductCardsShippingInfo = (
  items?: ShippingResolvableProductCardCollection
): ResolvedShippingInfo => {
  const mode = resolveProductCardsShippingMode(items);

  return {
    mode,
    label: resolveProductCardsShippingLabel(items, mode),
  };
};

export const shippingModeRequiresDelivery = (shippingMode: CourseShippingMode): boolean => {
  return shippingMode !== 'none';
};

export const shippingModeChargesDelivery = (shippingMode: CourseShippingMode): boolean => {
  return shippingMode === 'paid';
};
