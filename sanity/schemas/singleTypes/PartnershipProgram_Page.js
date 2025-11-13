import { removeMarkdown } from '../../utils/remove-markdown';

export default {
  name: 'PartnershipProgram_Page',
  title: 'Regulamin programu partnerskiego',
  type: 'document',
  icon: () => '🤝',
  fields: [
    {
      name: 'header_Heading',
      type: 'markdown',
      title: 'Nagłówek',
    },
    {
      name: 'header_Description',
      type: 'markdown',
      title: 'Opis',
    },
    {
      name: 'content',
      type: 'array',
      of: [{
        type: 'PartnershipProgram_Page_Content'
      }],
      title: 'Zawartość',
      fieldset: 'content',
    },
    {
      name: 'files',
      type: 'array',
      of: [{ type: 'file' }],
      title: 'Lista plików',
      fieldset: 'files',
    },
    {
      name: 'seo',
      type: 'seo',
      title: 'SEO',
      group: 'seo',
    },
  ],
  fieldsets: [
    {
      name: 'content',
      title: 'Zawartość podstrony',
      options: { collapsible: true, collapsed: true },
    },
    {
      name: 'files',
      title: 'Pliki',
      options: { collapsible: true, collapsed: true },
    },
  ],
  groups: [
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
};

export const PartnershipProgram_Page_Content = {
  name: 'PartnershipProgram_Page_Content',
  title: 'Zawartość',
  type: 'object',
  fields: [
    {
      name: 'title',
      type: 'markdown',
      title: 'Tytuł',
    },
    {
      name: 'description',
      type: 'markdown',
      title: 'Opis',
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
    prepare({ title, subtitle }) {
      return {
        title: removeMarkdown(title),
        subtitle: removeMarkdown(subtitle),
      };
    },
  },
};

