const title = 'Dobór kolorów';
const icon = () => '🎨';

export default {
  name: 'ColorPicker',
  type: 'object',
  title,
  icon,
  fields: [
    {
      name: 'name',
      type: 'markdown',
      title: 'Nazwa przedmiotu do którego będzie dobierany kolor',
      validation: Rule => Rule.required(),
    },
    {
      name: 'list',
      type: 'array',
      of: [{ type: 'ColorPicker_List' }],
      title: 'Lista kolorów',
      validation: Rule => Rule.required(),
    },
  ],
};

export const ColorPicker_List = {
  name: 'ColorPicker_List',
  type: 'object',
  title: 'Lista kolorów',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'nazwa koloru',
      validation: Rule => Rule.required(),
    },
    {
      name: 'color',
      type: 'color',
      title: 'Kolor',
      validation: Rule => Rule.required(),
    },
  ],
};
