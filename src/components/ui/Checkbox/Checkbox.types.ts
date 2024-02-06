import { FieldError } from 'react-hook-form';

export type Props = {
  label: string;
  register: {
    name: string;
  };
  error: string | undefined | FieldError;
};
