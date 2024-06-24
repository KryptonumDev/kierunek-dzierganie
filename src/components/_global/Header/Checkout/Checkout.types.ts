import type { Billing, Complexity, Discount, ImgType, MapPoint, Shipping } from '@/global/types';
import type { useCartItems } from '../Header.types';
import type { Dispatch, SetStateAction } from 'react';

export type Props = {
  setShowCheckout: () => void;
  showCheckout: boolean;
  NavigationCrossIcon: React.ReactNode;
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
  deliverySettings: {
    deliveryPrice: number;
    paczkomatPrice: number;
  } | null;
  freeShipping: number;
};

export type InputState = {
  freeDelivery: boolean;
  firmOrder: boolean;
  shippingSameAsBilling: boolean;
  shipping: Shipping;
  shippingMethod?: {
    data: string | MapPoint | null;
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
  client_notes: string;
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
  deliverySettings: {
    deliveryPrice: number;
    paczkomatPrice: number;
  } | null;
};

export type AsideProps = {
  input: InputState;
};

export type FormValues = {
  fullName?: string;
  email: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  phoneNumber?: string;

  shippingFullName?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingCountry?: string;
  shippingZipCode?: string;
  client_notes: string;

  nip?: string;
  companyName?: string;

  shippingSameAsBilling: boolean;

  invoiceType: 'Osoba prywatna' | 'Firma';
  shippingMethod?: string;
};