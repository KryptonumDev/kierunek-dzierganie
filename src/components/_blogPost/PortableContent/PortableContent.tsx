import { type Node } from '@/global/types';
import { portableTextToMarkdown } from '@/utils/portable-text-to-markdown';
import { slugify } from '@/utils/slugify';
import { PortableText, toPlainText, type PortableTextReactComponents } from '@portabletext/react';
import Markdown from '../../ui/markdown';
import BadgeSection, { BadgeSection_Query, type BadgeSectionTypes } from '../BadgeSection';
import ConversationShowcase, {
  ConversationShowcase_Query,
  type ConversationShowcaseTypes,
} from '../ConversationShowcase';
import HighlightedImage, { HighlightedImageTypes, HighlightedImage_Query } from '../HighlightedImage';
import ImageBadge, { ImageBadge_Query, type ImageBadgeTypes } from '../ImageBadge';
import ImagesGrid, { ImagesGrid_Query, type ImagesGridTypes } from '../ImagesGrid';
import ProcessComponent, { ProcessComponent_Query, type ProcessComponentTypes } from '../ProcessComponent';
import ProcessShowcase, { ProcessShowcase_Query, type ProcessShowcaseTypes } from '../ProcessShowcase';
import QuoteSection, { QuoteSection_Query, type QuoteSectionTypes } from '../QuoteSection';
import Standout, { Standout_Query, type StandoutTypes } from '../Standout';
import TableSection, { TableSection_Query, type TableSectionTypes } from '../TableSection';
import styles from './PortableContent.module.scss';

export default function PortableContent({ data }: { data: [] }) {
  console.log(data);
  const components = {
    types: {
      ImageBadge: ({ value }: { value: ImageBadgeTypes }) => <ImageBadge {...value} />,
      ImagesGrid: ({ value }: { value: ImagesGridTypes }) => <ImagesGrid {...value} />,
      TableSection: ({ value }: { value: TableSectionTypes }) => <TableSection {...value} />,
      BadgeSection: ({ value }: { value: BadgeSectionTypes }) => <BadgeSection {...value} />,
      HighlightedImage: ({ value }: { value: HighlightedImageTypes }) => <HighlightedImage {...value} />,
      ProcessComponent: ({ value }: { value: ProcessComponentTypes }) => <ProcessComponent {...value} />,
      Standout: ({ value }: { value: StandoutTypes }) => <Standout {...value} />,
      ProcessShowcase: ({ value }: { value: ProcessShowcaseTypes }) => <ProcessShowcase {...value} />,
      QuoteSection: ({ value }: { value: QuoteSectionTypes }) => <QuoteSection {...value} />,
      ConversationShowcase: ({ value }: { value: ConversationShowcaseTypes }) => <ConversationShowcase {...value} />,
    },
    block: {
      h2: ({ value }: { value: [] }) => (
        <Markdown.h2 id={slugify(toPlainText(value))}>{portableTextToMarkdown(value as Node)}</Markdown.h2>
      ),
      h3: ({ value }: { value: [] }) => (
        <Markdown.h3 id={slugify(toPlainText(value))}>{portableTextToMarkdown(value as Node)}</Markdown.h3>
      ),
      h4: ({ value }: { value: [] }) => (
        <Markdown.h4 id={slugify(toPlainText(value))}>{portableTextToMarkdown(value as Node)}</Markdown.h4>
      ),
      largeParagraph: ({ children }: { children: string }) => <p className={styles.largeParagraph}>{children}</p>,
    },
    listItem: {
      number: ({ children }: { children: string }) => <li className={styles.portableList}>{children}</li>,
      bullet: ({ children }: { children: string }) => <li className={styles.portableList}>{children}</li>,
    },
    list: {
      bullet: ({ children }: { children: string }) => <ul className={styles.portableList}>{children}</ul>,
      number: ({ children }: { children: string }) => <ol className={styles.portableList}>{children}</ol>,
    },
    marks: {
      link: ({ value, children }: { value: string; children: string }) => {
        return (
          <a
            href={value}
            target='_blank'
            rel='noreferrer noopener'
            className={styles.link}
          >
            {children}
          </a>
        );
      },
    },
  };

  return (
    <section>
      <PortableText
        value={data}
        components={components as unknown as Partial<PortableTextReactComponents>}
      />
    </section>
  );
}

const Block_Query = /* groq */ `
  _type == 'block' => {
    style,
    children[],
    markDefs[],
    listItem,
  },`;

export const PortableContent_Query = /* groq */ `
  content[] {
    _type,
    ${ImageBadge_Query}
    ${ImagesGrid_Query}
    ${TableSection_Query}
    ${BadgeSection_Query}
    ${HighlightedImage_Query}
    ${ProcessComponent_Query}
    ${Standout_Query}
    ${ProcessShowcase_Query}
    ${QuoteSection_Query}
    ${ConversationShowcase_Query}
    ${Block_Query}
  }`;
