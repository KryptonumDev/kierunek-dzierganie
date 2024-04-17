import type { Billing, Complexity, ImgType, Shipping } from '@/global/types';
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
  virtualWallet: number;
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
  needDelivery: boolean;
  user_id?: string;
  amount: number;
  paid_at?: string;
  usedDiscount?: string;
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
