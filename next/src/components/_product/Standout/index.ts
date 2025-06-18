import Standout from './Standout';
export default Standout;
export type { StandoutTypes } from './Standout.types';

export const Standout_Query = `
  _type == "Standout" => {
    _type,
    heading,
    paragraph,
  },
`;
