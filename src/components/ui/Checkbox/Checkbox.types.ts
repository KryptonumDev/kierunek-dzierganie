import { FieldErrors } from 'react-hook-form';

export type Props = {
  label: React.ReactNode;
  register: {
    name: string;
  };
  errors: FieldErrors;
} & React.InputHTMLAttributes<HTMLInputElement>;
