export default {
  name: 'productVariant',
  title: 'Warianty produktu fizycznego',
  type: 'object',
  icon: () => '',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Nazwa wariantu',
    },
    {
      name: 'price',
      type: 'number',
      title: 'Cena w groszach',
      validation: Rule => Rule.required().min(0),
    },
    {
      name: 'discount',
      type: 'number',
      title: 'Cena w groszach po rabacie',
      validation: Rule => Rule.min(0),
    },
    {
      name: 'countInStock',
      type: 'number',
      title: 'Ilość w magazynie',
      validation: Rule => Rule.required().min(0),
    },
    {
      name: 'attributes',
      type: 'array',
      title: 'Atrybuty',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              type: 'string',
              title: 'Nazwa atrybutu',
            },
            {
              name: 'type',
              type: 'string',
              title: 'Typ atrybutu',
              options: {
                list: [
                  {
                    title: 'Tekst',
                    value: 'text',
                  },
                  {
                    title: 'Kolor',
                    value: 'color',
                  },
                ],
              },
            },
            {
              name: 'value',
              type: 'string',
              description: 'W przypadku typu kolor wpisz kod koloru w formacie #RRGGBB',
              title: 'Wartość atrybutu',
            },
          ],
        },
      ],
    },
    {
      name: 'videoProvider',
      type: 'string',
      title: 'Dostawca wideo',
      description: 'Wybierz platformę hostingową dla tego filmu (brak wyboru oznacza Vimeo)',
      options: {
        list: [
          { title: 'Vimeo', value: 'vimeo' },
          { title: 'YouTube', value: 'youtube' },
          { title: 'Bunny.net', value: 'bunnyNet' },
        ],
        layout: 'radio',
      },
      initialValue: 'vimeo',
    },
    {
      name: 'featuredVideo',
      type: 'string',
      title: 'Link do filmu wyróżniającego',
      description: 'Link do iframe',
    },
    {
      name: 'gallery',
      type: 'array',
      title: 'Galeria',
      of: [{ type: 'image', validation: Rule => Rule.required() }],
    },
  ],
};
