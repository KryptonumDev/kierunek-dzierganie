export type Props = {
  heading: string;
  paragraph?: string;
}

export type QueryProps = {
  email: string;
  tel: string;
  messenger: string;
}

export type StatusProps = {
  sending: boolean;
  success?: boolean;
}