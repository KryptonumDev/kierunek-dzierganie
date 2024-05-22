export type FormValues = {
  email: string;
  password: string;
  accept: boolean;
};

export type FormProps = {
  isRegister: boolean;
  setRegister: (value: boolean) => void;
}