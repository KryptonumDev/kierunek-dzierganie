import TabSection from './TabSection';
export type { Props as TabSectionProps } from './TabSection.types';
export default TabSection;

export const TabSection_Query = `
  _type == "TabSection" => {
    _type,
    heading,
    paragraph,
    list[] {
      title,
      description
    },
    cta {
      text,
      href
    },
  },
`;