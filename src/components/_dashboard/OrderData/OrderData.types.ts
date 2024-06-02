import type { Order } from '@/global/types';

export type OrderDataTypes = {
  order: Order & { refundAmount?: number; statement?: string };
};
