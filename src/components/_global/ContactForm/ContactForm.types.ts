export type Props = {
  heading: string;
  paragraph?: string;
  aboveTheFold: boolean;
};

export type QueryProps = {
  email: string;
  email_orders?: string;
  email_support?: string;
  tel: string;
  messenger: string;
};

export type StatusProps = {
  sending: boolean;
  success?: boolean;
};
