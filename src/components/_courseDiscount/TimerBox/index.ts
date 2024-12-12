import TimerBox from './TimerBox';
export default TimerBox;
export type { TimerBoxTypes } from './TimerBox.types';

export const TimerBox_Query = `
  _type == 'timerBox' => {
    heading,
    paragraph,
  }
`;
