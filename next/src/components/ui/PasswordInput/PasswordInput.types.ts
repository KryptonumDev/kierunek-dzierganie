import { FieldErrors } from 'react-hook-form';

export type Props = {
  textarea?: boolean;
  password?: boolean;
  isRegister?: boolean;
  label: string;
  register: {
    name: string;
  };
  value?: string;
  errors: FieldErrors;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;
