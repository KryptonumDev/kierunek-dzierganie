export type Props = {
  heading: string;
  list: {
    title: string;
    paragraph: string;
    cta: {
      text: string;
      href: string;
    };
  }[];
};
