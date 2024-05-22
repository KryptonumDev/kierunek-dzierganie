import type { PortableTextBlock } from '@portabletext/react';

export type TabsTypes = {
  tabs: {
    name: string;
    content: PortableTextBlock;
  }[];
};

export type SwitcherTypes = {
  tabs: {
    name: string;
    content: React.ReactNode;
  }[];
};
