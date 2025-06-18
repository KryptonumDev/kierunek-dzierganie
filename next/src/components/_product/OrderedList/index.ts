import OrderedList from './OrderedList';
export default OrderedList;
export type { OrderedListTypes } from './OrderedList.types';

export const OrderedList_Query = `
  _type == "OrderedList" => {
    _type,
    heading,
    list[],
    paragraph,
  },
`;
