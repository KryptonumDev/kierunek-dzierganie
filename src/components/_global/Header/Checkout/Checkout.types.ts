import type { Billing, Complexity, Discount, ImgType, InpostPoint, Shipping } from '@/global/types';
import type { useCartItems } from '../Header.types';
import type { Dispatch, SetStateAction } from 'react';

export type Props = {
  setShowCheckout: () => void;
  showCheckout: boolean;
  CrossIcon: React.ReactNode;
  fetchedItems: useCartItems['fetchedItems'];
  goToCart: () => void;
  userEmail?: string;
  shipping?: Shipping;
  billing?: Billing;
  userId?: string;
  virtualWallet: number;
  usedDiscount: Discount | null;
  usedVirtualMoney: number | null;
  setUsedDiscount: Dispatch<SetStateAction<Discount | null>>;
};

export type InputState = {
  firmOrder: boolean;
  shippingSameAsBilling: boolean;
  shipping: Shipping;
  shippingMethod: {
    inpostPointData: string | InpostPoint | null;
    name: string;
    price: number;
  };
  billing: Billing & {
    email: string;
  };
  products?: {
    array: {
      id: string;
      name: string;
      price: number;
      quantity: number;
      discount: number;
      image: ImgType;
      complexity: Complexity | null;
    }[];
  };
  delivery: number;
  virtualMoney?: number | null;
  discount?: Discount | null;
  needDelivery: boolean;
  user_id?: string;
  amount: number;
  totalAmount: number;
  paid_at?: string;
  payment_id?: string;
  paymentMethod?: string;
};

export type MappingProps = {
  goToCart: () => void;
  setStep: (step: number) => void;
  input: InputState;
  setInput: Dispatch<SetStateAction<InputState>>;
};

export type AsideProps = {
  input: InputState;
};
