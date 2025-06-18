import React, { useMemo } from 'react';
import { MarkdownInput, MarkdownInputProps } from 'sanity-plugin-markdown';

export function CustomMarkdownInput(props) {
  const reactMdeProps: MarkdownInputProps['reactMdeProps'] = useMemo(() => {
    return {
      options: {
        toolbar: ['guide', '|', 'bold', 'italic', 'link', 'image', '|', 'preview'],
        minHeight: '30px',
        placeholder: '**Wyróżniony** tekst',
      },
    };
  }, []);

  return (
    <MarkdownInput
      {...props}
      reactMdeProps={reactMdeProps}
    />
  );
}
