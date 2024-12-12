import TimerBox from './TimerBox';
export default TimerBox;
export type { TimerBoxTypes } from './TimerBox.types';

export const TimerBox_Query = `
  timerBox {
  heading,
  paragraph,
}
`;
