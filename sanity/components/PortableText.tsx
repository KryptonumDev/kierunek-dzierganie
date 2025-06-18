import React from 'react';

export default {
  name: 'PortableText',
  type: 'array',
  title: 'Content',
  of: [
    {
      type: 'block',
      styles: [
        {
          title: 'Normalna czcionka',
          value: 'normal',
          component: ({ children }) => <span style={{ fontWeight: 400 }}>{children}</span>,
        },
        {
          title: 'H2',
          value: 'h2',
          component: ({ children }) => <h2 style={{ fontSize: '1.8em', fontWeight: 400, margin: 0 }}>{children}</h2>,
        },
        {
          title: 'H3',
          value: 'h3',
          component: ({ children }) => <h3 style={{ fontSize: '1.5em', fontWeight: 400, margin: 0 }}>{children}</h3>,
        },
        {
          title: 'H4',
          value: 'h4',
          component: ({ children }) => <h4 style={{ fontSize: '1.3em', fontWeight: 400, margin: 0 }}>{children}</h4>,
        },
      ],
      marks: {
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'External link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                initialValue: 'https://',
              },
            ],
          },
        ],
      },
    },
    { type: 'ImageBadge' },
    { type: 'ImagesGrid' },
    { type: 'TableSection' },
    { type: 'BadgeSection' },
    { type: 'HighlightedImage' },
    { type: 'ProcessComponent' },
    { type: 'ArticleGreetings' },
    { type: 'Standout' },
    { type: 'image', name: 'LargeImage', title: 'Duży obraz', icon: () => '🖼️' },
    { type: 'ProcessShowcase' },
    { type: 'QuoteSection' },
    { type: 'VideoSection' },
    { type: 'ConversationShowcase' },
    { type: 'ColorPicker' },
  ],
};
