import type { Control, FieldErrors, FieldValues, Path } from 'react-hook-form';

export type SelectTypes<T> = {
  control: Control<T & FieldValues>;
  label: string;
  name: Path<T & FieldValues>;
  rules?: {
    [key: string]: string;
  };
  options: {
    value: string;
    label: string;
  }[];
  errors: FieldErrors;
  tabIndex?: -1 | 0;
  defaultValue?: {
    value: string;
    label: string;
  };
};
