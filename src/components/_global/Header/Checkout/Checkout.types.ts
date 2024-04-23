import type { Billing, Complexity, Discount, ImgType, Shipping } from '@/global/types';
import type { useCartItems } from '../Header.types';

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
};

export type InputState = {
  firmOrder: boolean;
  shippingSameAsBilling: boolean;
  shipping: Shipping;
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
  setInput: (input: InputState) => void;
};

export type AsideProps = {
  input: InputState;
};
