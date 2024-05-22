export type FaqTypes = {
  heading: string;
  paragraph?: string;
  list: {
    question: string;
    answer: string;
  }[];
};

export type ListTypes = {
  Indicator: JSX.Element;
  list: {
    question: JSX.Element;
    answer: JSX.Element;
  }[];
};
