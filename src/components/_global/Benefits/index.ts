import Benefits from './Benefits';
export type { Props as BenefitsProps } from './Benefits.types';
export default Benefits;

export const Benefits_Query = `
  _type == "Benefits" => {
    _type,
    'benefits': list,
    claim,
    cta {
      text,
      href,
    },
    cta_Annotation,
  },
`;