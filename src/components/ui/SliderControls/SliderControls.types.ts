export type Props = {
  handlePrev: () => void;
  activeIndex: number;
  length: number;
  slideTo: (index: number) => void;
  handleNext: () => void;
}