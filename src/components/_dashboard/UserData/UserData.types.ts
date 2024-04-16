import type { Billing } from '@/global/types';

export type QueryProps = {
  id: string;
  left_handed: boolean;
  email: string;
  avatar_url: string;
  billing_data: Billing;
};

export type UserDataTypes = {
  data: QueryProps;
};

export type AuthorizationDataFormTypes = {
  email: string;
  password: string;
};

export type AuthorizationDataTypes = {
  id: string;
  email: string;
};

export type PersonalDataFormTypes = {
  firstName: string;
  address: string;
  postcode: string;
  city: string;
  country: string;
  phone: string;
  invoiceType: 'Osoba prywatna' | 'Firma';

  company?: string;
  nip?: string;
};

export type PersonalDataTypes = {
  id: string;
  billing_data: Billing;
};

export type DeletePopupDataTypes = {
  openDeletePopup: boolean;
  setOpenDeletePopup: (value: boolean) => void;
};

export type DeletePopupFormTypes = {
  confirmation: string;
};
