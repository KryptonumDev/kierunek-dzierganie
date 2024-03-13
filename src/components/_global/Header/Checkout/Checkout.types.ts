import type { useCartItems } from '../Header.types';

export type Props = {
  setShowCheckout: () => void;
  showCheckout: boolean;
  CrossIcon: React.ReactNode;
  cart: useCartItems['cart'];
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
    }[];
  };
  user_id?: string;
  amount: number;
  paid_at?: string;
  usedDiscount?: string;
  payment_id?: string;
  paymentMethod?: string;
};

export type MappingProps = {
  nextStep: () => Promise<void>;
  prevStep: () => Promise<void>;
  goToCart: () => void;
  setStep: (step: number) => void;
  input: InputState;
  setInput: (input: InputState) => void;
  cart: useCartItems['cart'];
  fetchedItems: useCartItems['fetchedItems'];
};
