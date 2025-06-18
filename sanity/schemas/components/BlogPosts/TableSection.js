const title = 'Tabela';
const icon = () => '📊';

export default {
  name: 'TableSection',
  type: 'object',
  title,
  icon,
  fields: [
    {
      name: 'table',
      type: 'array',
      of: [{ type: 'TableSection_Table' }],
      title: 'Tabela',
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      table: 'table',
    },
    prepare({ table }) {
      return {
        title: `[${title}] - liczba wierszy: ${table.length}`,
        media: icon,
      };
    },
  },
};

export const TableSection_Table = {
  name: 'TableSection_Table',
  type: 'object',
  title: 'Tabela',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Tytuł',
      validation: Rule => Rule.required(),
    },
    {
      name: 'description',
      type: 'string',
      title: 'Opis',
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
    },
    prepare({ title, description }) {
      return {
        title: title,
        subtitle: description,
      };
    },
  },
};
