import { FieldErrors } from 'react-hook-form';

export type Props = {
  register: {
    name: string;
  };
  label: string;
  errors: FieldErrors;
} & React.InputHTMLAttributes<HTMLInputElement> 
