export type Props = {
  id: string;
  disabled?: boolean;
  variant?: string;
  quantity?: number;
  voucherData?: {
    amount: number;
    type: 'DIGITAL' | 'PHYSICAL';
    dedication: {
      from: string;
      to: string;
      message: string;
    } | null;
  };
  data: {
    price: number;
    discount?: number;
    _id: string;
    name: string;
    _type: string;
    variant?: string;
    basis?: string;
  }
};
