export type Props = {
  registerTitle: JSX.Element;
  loginTitle: JSX.Element;
  registerText: JSX.Element;
  loginText: JSX.Element;
};

export type FormValues = {
  email: string;
  password: string;
  accept: boolean;
};

export type FormProps = {
  isRegister: boolean;
  setRegister: (value: boolean) => void;
}