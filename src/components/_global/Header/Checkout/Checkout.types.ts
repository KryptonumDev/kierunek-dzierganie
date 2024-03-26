import type { ImgType } from '@/global/types';
import type { useCartItems } from '../Header.types';

export type Props = {
  setShowCheckout: () => void;
  showCheckout: boolean;
  CrossIcon: React.ReactNode;
  fetchedItems: useCartItems['fetchedItems'];
  goToCart: () => void;
};

export type InputState = {
  firmOrder: boolean;
  shippingSameAsBilling: boolean;
  shipping: {
    firstName: string;
    address1: string;
    city: string;
    country: string;
    postcode: string;
    email: string;
    phone: string;
    company: string;
  };
  billing: {
    nip: string;
    firstName: string;
    address1: string;
    city: string;
    country: string;
    postcode: string;
    email: string;
    phone: string;
    company: string;
  };
  products?: {
    array: {
      id: string;
      name: string;
      price: number;
      quantity: number;
      discount: number;
      image: ImgType;
      complexity: 1 | 2 | 3 | null;
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
