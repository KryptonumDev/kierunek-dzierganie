import type { Order } from '@/global/types';

export type CreateOrderTypes = {
  data: Order;
  type: 'CREATE_ORDER' | 'NEW_ORDER' | 'ORDER_CANCELLED' | 'ORDER_COMPLETED'  ;
};
