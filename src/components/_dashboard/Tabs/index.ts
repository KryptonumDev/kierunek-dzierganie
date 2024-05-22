import Tabs from './Tabs';
export default Tabs;
export type { TabsTypes } from './Tabs.types';

export const Tabs_Query = `
  tabs[] {
    name,
    content,
  },
`;
