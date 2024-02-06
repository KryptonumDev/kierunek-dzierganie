export type Props = {
  heading: string;
  paragraph?: string;
  list: {
    question: string;
    answer: string;
  }[];
};