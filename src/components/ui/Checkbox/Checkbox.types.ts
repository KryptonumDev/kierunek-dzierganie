import { FieldErrors } from 'react-hook-form';

export type Props = {
  label: string;
  register: {
    name: string;
  };
  errors?: FieldErrors;
} & React.InputHTMLAttributes<HTMLInputElement>;
