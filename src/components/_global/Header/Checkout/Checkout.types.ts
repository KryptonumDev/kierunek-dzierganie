import type { useCartItems } from '../Header.types';

export type Props = {
  setShowCheckout: () => void;
  showCheckout: boolean;
  CrossIcon: React.ReactNode;
} & useCartItems;

export type InputState = {
  firmOrder: boolean;
  billingDifferentThanShipping: boolean;
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
  paymentMethod: {
    name: string;
    title: string;
  };
};

export type MappingProps = {
  nextStep: () => Promise<void>;
  setStep: (step: number) => void;
  input: InputState;
  setInput: (input: InputState) => void;
  cart: useCartItems['cart'];
  fetchedItems: useCartItems['fetchedItems'];
};
