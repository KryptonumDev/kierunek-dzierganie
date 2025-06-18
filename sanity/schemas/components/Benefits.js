import { removeMarkdown } from '../../utils/remove-markdown';

export default {
  name: 'Benefits',
  title: 'Benefity',
  type: 'object',
  fields: [
    {
      name: 'list',
      type: 'array',
      of: [{ type: 'markdown' }],
      title: 'Lista',
    },
    {
      name: 'claim',
      type: 'string',
      title: 'Claim',
    },
    {
      name: 'cta',
      type: 'cta',
      title: 'CTA',
    },
    {
      name: 'cta_Annotation',
      type: 'markdown',
      title: 'CTA Annotation',
    },
  ],
  preview: {
    select: {
      list: 'list',
      claim: 'claim',
    },
    prepare({ list, claim }) {
      return {
        title: `[Benefity] ${removeMarkdown(claim)}`,
        subtitle: `${list.length} benefitów`,
      };
    },
  },
};
