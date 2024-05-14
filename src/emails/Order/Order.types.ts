import type { Billing, Complexity, Discount, ImgType, MapPoint, ProductCard, Shipping } from '@/global/types';

export type CreateOrderTypes = {
  data: {
    id: string;
    amount: number;
    created_at: string;
    payment_method: string;
    products: {
      array: {
        complexity: Complexity;
        courses: ProductCard;
        discount: number;
        image: ImgType;
        type: 'product' | 'course' | 'bundle';
        variantId: string;
        id: string;
        name: string;
        price: number;
        quantity: number;
      }[];
    };
    shipping_method: {
      data: MapPoint | null;
      name: string;
      price: number;
    };
    virtualMoney?: number | null;
    used_discount?: Discount | null;
    billing: Billing;
    shipping: Shipping;
  };
  type: 'CREATE_ORDER' | 'NEW_ORDER' | 'ORDER_CANCELLED' | 'ORDER_COMPLETED'  ;
};
