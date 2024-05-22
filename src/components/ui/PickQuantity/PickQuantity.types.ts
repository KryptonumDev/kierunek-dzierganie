export type PickQuantityTypes = {
  defaultValue?: number;
  max: number;
  min: number;
  change: (value: number) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;
