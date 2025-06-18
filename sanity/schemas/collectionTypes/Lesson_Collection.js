export default {
  name: 'lesson',
  title: 'Lekcje',
  type: 'document',
  icon: () => '🎥',
  fields: [
    // Unique name to identify the lesson
    {
      name: 'name',
      type: 'string',
      title: 'Nazwa',
      validation: Rule => Rule.required(),
    },
    // The title that will be visible to a user
    {
      name: 'title',
      type: 'string',
      title: 'Tytuł',
      validation: Rule => Rule.required(),
    },
    {
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name',
      },
      title: 'Slug',
      validation: Rule => Rule.required(),
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
      name: 'video',
      type: 'string',
      title: 'Link do filmiku',
      validation: Rule => Rule.required(),
    },
    {
      name: 'video_alter',
      type: 'string',
      title: 'Link do filmiku dla leworęcznych',
      validation: Rule => Rule.required(),
    },
    {
      name: 'libraryId',
      type: 'string',
      title: 'ID biblioteki',
      description: 'ID biblioteki bunny.net pojedynczego filmu. UWAGA: ID nadpisuje ID biblioteki w kursie',
      hidden: ({ parent }) => parent?.videoProvider !== 'bunnyNet',
    },
    {
      name: 'libraryApiKey',
      type: 'string',
      title: 'Klucz API biblioteki',
      description:
        'Klucz API biblioteki bunny.net pojedynczego filmu. UWAGA: Klucz nadpisuje klucz biblioteki w kursie',
      hidden: ({ parent }) => parent?.videoProvider !== 'bunnyNet',
    },
    {
      name: 'lengthInMinutes',
      type: 'number',
      title: 'Długość w minutach',
      validation: Rule => Rule.required(),
    },
    {
      name: 'files',
      type: 'array',
      title: 'Pliki do pobrania',
      of: [
        {
          type: 'file',
        },
      ],
    },
    {
      name: 'files_alter',
      type: 'array',
      title: 'Pliki do pobrania dla leworęcznych',
      of: [
        {
          type: 'file',
        },
      ],
    },
    {
      name: 'description',
      type: 'markdown',
      title: 'Czego się dzisiaj nauczysz?',
    },
    {
      name: 'flex',
      type: 'array',
      title: 'Sekcje dwukolumnowe z opisem i obrazkiem',
      of: [
        {
          type: 'ImageAndText',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
};
