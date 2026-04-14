import type {
  BundleCourseShippingLink,
  CourseShippingMode,
  ProductCard,
  ShipmentDeclaredValueSource,
} from '@/global/types';
import { shippingModeRequiresDelivery } from './resolve-shipping-mode';

export type ResolvedShipmentDeclaredValue = {
  value: number | null;
  source: ShipmentDeclaredValueSource | null;
};

type DeclaredValueResolvableProductCard = Pick<
  ProductCard,
  '_type' | 'shippingMode' | 'shipmentDeclaredValue' | 'price' | 'discount' | 'quantity' | 'courses' | 'voucherData'
>;

const normalizeShippingMode = (shippingMode?: CourseShippingMode | null): CourseShippingMode => shippingMode ?? 'none';

const hasDeclaredValueOverride = (shipmentDeclaredValue?: number | null): shipmentDeclaredValue is number =>
  typeof shipmentDeclaredValue === 'number' && shipmentDeclaredValue >= 0;

const getEffectiveLineValue = (price?: number | null, discount?: number | null, quantity?: number | null): number | null => {
  if (typeof price !== 'number') return null;

  const effectiveUnitPrice = typeof discount === 'number' ? discount : price;
  const normalizedQuantity = quantity ?? 1;

  return effectiveUnitPrice * normalizedQuantity;
};

export const resolveCourseShipmentDeclaredValue = (
  item?: Pick<DeclaredValueResolvableProductCard, 'shippingMode' | 'shipmentDeclaredValue' | 'price' | 'discount' | 'quantity'> | null
): ResolvedShipmentDeclaredValue => {
  if (!item || !shippingModeRequiresDelivery(normalizeShippingMode(item.shippingMode))) {
    return { value: null, source: null };
  }

  if (hasDeclaredValueOverride(item.shipmentDeclaredValue)) {
    return {
      value: item.shipmentDeclaredValue,
      source: 'course_override',
    };
  }

  return {
    value: getEffectiveLineValue(item.price, item.discount, item.quantity),
    source: 'line_price_fallback',
  };
};

const resolveBundleCourseDeclaredValue = (
  course?: Pick<BundleCourseShippingLink, 'shippingMode' | 'shipmentDeclaredValue' | 'price' | 'discount'> | null
): number | null => {
  if (!course || !shippingModeRequiresDelivery(normalizeShippingMode(course.shippingMode))) {
    return null;
  }

  if (hasDeclaredValueOverride(course.shipmentDeclaredValue)) {
    return course.shipmentDeclaredValue;
  }

  return getEffectiveLineValue(course.price, course.discount, 1);
};

export const resolveBundleShipmentDeclaredValue = (
  item?: Pick<DeclaredValueResolvableProductCard, 'courses'> | null
): ResolvedShipmentDeclaredValue => {
  const courseValues = item?.courses?.map(resolveBundleCourseDeclaredValue).filter((value): value is number => value !== null) ?? [];

  if (courseValues.length === 0) {
    return { value: null, source: null };
  }

  return {
    value: courseValues.reduce((sum, value) => sum + value, 0),
    source: 'bundle_resolved',
  };
};

export const resolveProductCardShipmentDeclaredValue = (
  item?: DeclaredValueResolvableProductCard | null
): ResolvedShipmentDeclaredValue => {
  if (!item) {
    return { value: null, source: null };
  }

  switch (item._type) {
    case 'product':
      return {
        value: getEffectiveLineValue(item.price, item.discount, item.quantity),
        source: 'product_default',
      };
    case 'voucher':
      if (item.voucherData?.type !== 'PHYSICAL') {
        return { value: null, source: null };
      }

      return {
        value: getEffectiveLineValue(item.price, item.discount, item.quantity),
        source: 'line_price_fallback',
      };
    case 'course':
      return resolveCourseShipmentDeclaredValue(item);
    case 'bundle':
      return resolveBundleShipmentDeclaredValue(item);
    default:
      return { value: null, source: null };
  }
};
