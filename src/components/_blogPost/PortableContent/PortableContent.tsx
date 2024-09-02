import { type ImgType, type Node } from '@/global/types';
import { portableTextToMarkdown } from '@/utils/portable-text-to-markdown';
import { slugify } from '@/utils/slugify';
import { PortableText, toPlainText, type PortableTextReactComponents } from '@portabletext/react';
import Markdown from '@/components/ui/markdown';
import BadgeSection, { BadgeSection_Query, type BadgeSectionTypes } from '@/components/_blogPost/BadgeSection';
import ConversationShowcase, {
  ConversationShowcase_Query,
  type ConversationShowcaseTypes,
} from '../ConversationShowcase';
import HighlightedImage, { type HighlightedImageTypes, HighlightedImage_Query } from '../HighlightedImage';
import ImageBadge, { ImageBadge_Query, type ImageBadgeTypes } from '../ImageBadge';
import ImagesGrid, { ImagesGrid_Query, type ImagesGridTypes } from '../ImagesGrid';
import ProcessComponent, { ProcessComponent_Query, type ProcessComponentTypes } from '../ProcessComponent';
import ProcessShowcase, { ProcessShowcase_Query, type ProcessShowcaseTypes } from '../ProcessShowcase';
import QuoteSection, { QuoteSection_Query, type QuoteSectionTypes } from '../QuoteSection';
import Standout, { Standout_Query, type StandoutTypes } from '../Standout';
import TableSection, { TableSection_Query, type TableSectionTypes } from '../TableSection';
import styles from './PortableContent.module.scss';
import LargeImage, { LargeImage_Query } from '../LargeImage';
import ArticleNavigation from '../ArticleNavigation';
import { type PortableContentTypes } from './PortableContent.types';
import ArticleGreetings, { type ArticleGreetingsTypes, ArticleGreetings_Query } from '../ArticleGreetings';
import VideoSection, { type VideoSectionTypes, VideoSection_Query } from '../VideoSection';
import { generateTableOfContent } from '@/utils/generate-table-of-content';
import TableOfContent from '../TableOfContent/TableOfContent';
import ShareArticle from '../ShareArticle';
import ColorPicker, { ColorPickerTypes, ColorPicker_Query } from '../ColorPicker';

export default function PortableContent({ data, previousBlog, nextBlog, links }: PortableContentTypes) {
  if (!data) return null;

  const components = {
    types: {
      ImageBadge: ({ value }: { value: ImageBadgeTypes }) => <ImageBadge {...value} />,
      ImagesGrid: ({ value }: { value: ImagesGridTypes }) => <ImagesGrid {...value} />,
      TableSection: ({ value }: { value: TableSectionTypes }) => <TableSection {...value} />,
      BadgeSection: ({ value }: { value: BadgeSectionTypes }) => <BadgeSection {...value} />,
      HighlightedImage: ({ value }: { value: HighlightedImageTypes }) => <HighlightedImage {...value} />,
      ProcessComponent: ({ value }: { value: ProcessComponentTypes }) => <ProcessComponent {...value} />,
      ArticleGreetings: ({ value }: { value: ArticleGreetingsTypes }) => <ArticleGreetings {...value} />,
      Standout: ({ value }: { value: StandoutTypes }) => <Standout {...value} />,
      LargeImage: ({ value }: { value: ImgType }) => <LargeImage {...value} />,
      ProcessShowcase: ({ value }: { value: ProcessShowcaseTypes }) => <ProcessShowcase {...value} />,
      QuoteSection: ({ value }: { value: QuoteSectionTypes }) => <QuoteSection {...value} />,
      ConversationShowcase: ({ value }: { value: ConversationShowcaseTypes }) => <ConversationShowcase {...value} />,
      VideoSection: ({ value }: { value: VideoSectionTypes }) => <VideoSection {...value} />,
      ColorPicker: ({ value }: { value: ColorPickerTypes }) => <ColorPicker {...value} />,
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
    },
    listItem: {
      number: ({ children }: { children: React.ReactNode[] }) => <Markdown.li>{children[0] as string}</Markdown.li>,
      bullet: ({ children }: { children: React.ReactNode[] }) => (
        <li>
          <BulletList />
          {children}
        </li>
      ),
    },
    list: {
      bullet: ({ children }: { children: React.ReactNode }) => <ul className={styles.unorderedList}>{children}</ul>,
      number: ({ children }: { children: React.ReactNode }) => <ol className={styles.orderedList}>{children}</ol>,
    },
    marks: {
      link: ({ value, children }: { value: { href: string }; children: string }) => {
        return (
          <a
            href={value.href}
            target='_blank'
            rel='noreferrer noopener'
            className='link'
          >
            {children}
          </a>
        );
      },
    },
  };

  const content = generateTableOfContent(data);

  return (
    <section className={styles.PortableContent}>
      <TableOfContent content={content} />
      <div className={styles.blogContent}>
        <PortableText
          value={data}
          components={components as unknown as Partial<PortableTextReactComponents>}
        />
        <ArticleNavigation
          previousBlog={previousBlog}
          nextBlog={nextBlog}
        />
        <ShareArticle {...links} />
      </div>
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
  portableText[] {
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
    ${LargeImage_Query}
    ${ArticleGreetings_Query}
    ${Block_Query}
    ${VideoSection_Query}
    ${ColorPicker_Query}
  },`;

const BulletList = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='28'
    height='21'
    fill='none'
    viewBox='0 0 28 21'
  >
    <path
      fill='currentColor'
      d='M8.133 7.79a.375.375 0 00-.675-.325l.675.325zm-6.758 2.336a.375.375 0 10-.75 0h.75zm15.373.234a.375.375 0 10.158-.733l-.158.733zm3.583-3.059l.116.357-.116-.357zm-7.431 0l.356.118L12.9 7.3zm14.26 3.19l-.362-.094.363.095zm-15.967 3.69l.194-.321-.194.32zM17.82.72l-.069.37.069-.37zm0 17.647l-.087-.365.087.365zM16.314 6.006l-.01-.375.01.375zm10.847 8.672l-.354-.124-.003.008-.002.009.359.107zm-15.266 4.188l-.176.33.177-.33zM7.458 7.465C6.487 9.478 5.6 10.63 4.843 11.239c-.745.597-1.35.662-1.82.536-.494-.133-.912-.498-1.217-.891a3.218 3.218 0 01-.338-.538 1.59 1.59 0 01-.08-.187c-.018-.057-.013-.062-.013-.033h-.75c0 .097.028.196.053.271.028.085.068.179.116.278.097.199.238.433.419.667.356.462.9.965 1.615 1.157.739.199 1.586.045 2.484-.675.884-.71 1.829-1.975 2.821-4.034l-.675-.325zm9.448 2.162c-.17-.037-.27-.08-.32-.112-.048-.03-.021-.03-.012.017.007.042-.014.043.024-.016.039-.059.116-.144.251-.25.55-.438 1.755-1.011 3.598-1.608l-.231-.713c-1.853.6-3.17 1.206-3.834 1.733a1.892 1.892 0 00-.412.428.771.771 0 00-.134.563.73.73 0 00.346.479c.155.099.351.166.566.212l.158-.733zm3.541-1.969c.418-.135.712-.135.91-.078a.626.626 0 01.4.337c.189.371.176 1.042-.144 1.836-.63 1.563-2.312 3.255-4.786 3.255v.75c2.848 0 4.766-1.947 5.482-3.724.353-.875.45-1.8.117-2.457a1.374 1.374 0 00-.861-.718c-.388-.112-.843-.078-1.349.086l.231.713zm-3.62 5.35c-1.29 0-2.562-.228-3.318-.986-.72-.725-1.089-2.066-.253-4.603l-.712-.235c-.872 2.647-.582 4.346.434 5.367.982.986 2.528 1.207 3.849 1.207v-.75zm-3.571-5.59c.102-.31.223-.605.36-.884l-.674-.33a7.69 7.69 0 00-.398.98l.712.235zm.36-.884c1.535-3.131 5.172-4.322 8.322-3.722l.14-.737c-3.385-.645-7.413.615-9.136 4.13l.674.33zm8.322-3.722a7.55 7.55 0 012.174.76l.357-.659a8.297 8.297 0 00-2.39-.838l-.141.737zm2.174.76c1.098.594 1.981 1.466 2.485 2.593.503 1.126.642 2.536.201 4.232l.726.189c.477-1.837.34-3.424-.242-4.727-.581-1.3-1.593-2.286-2.813-2.946l-.357.66zm2.686 6.825a12.65 12.65 0 01-.043.16l.724.198.045-.169-.726-.189zm-.043.16c-.49 1.787-1.267 3.052-2.207 3.928-.94.875-2.062 1.378-3.27 1.613l.144.736c1.322-.257 2.578-.815 3.637-1.8 1.058-.986 1.9-2.38 2.42-4.28l-.724-.197zm-5.476 5.541c-1.769.344-3.713.109-5.492-.382-1.778-.49-3.363-1.227-4.4-1.856l-.389.641c1.095.665 2.744 1.43 4.59 1.938 1.843.509 3.911.77 5.834.395l-.143-.736zm-9.892-2.238c-.476-.289-.93-.825-1.309-1.558-.377-.729-.666-1.626-.83-2.6l-.74.124c.175 1.038.486 2.012.904 2.82.416.803.95 1.47 1.586 1.855l.389-.641zM9.248 9.702c-.213-1.27-.208-2.651.085-3.934l-.73-.168c-.319 1.391-.322 2.873-.095 4.226l.74-.124zm.085-3.934c.36-1.575 1.148-2.978 2.476-3.87 1.326-.891 3.245-1.31 5.943-.807l.138-.738c-2.837-.528-4.97-.106-6.499.922C9.864 2.3 8.992 3.893 8.602 5.6l.731.168zm8.42-4.677c1.298.241 2.381.64 3.272 1.155l.375-.65c-.974-.561-2.139-.988-3.51-1.243l-.138.738zm3.272 1.155c.27.156.523.322.759.498l.448-.601a8.448 8.448 0 00-.832-.547l-.375.65zm.759.498c1.755 1.31 2.605 3.166 2.75 5.156l.748-.054c-.16-2.177-1.097-4.246-3.05-5.703l-.448.6zm2.75 5.156c.218 2.988-1.159 6.252-3.434 8.287l.5.559c2.44-2.182 3.917-5.67 3.682-8.9l-.748.054zM21.1 16.187c-.982.878-2.123 1.52-3.366 1.816l.174.73c1.38-.33 2.631-1.038 3.692-1.987l-.5-.56zm-3.366 1.816c-2.35.56-4.77-.495-6.474-2.227-1.711-1.74-2.594-4.053-2.023-5.901l-.717-.221c-.683 2.214.39 4.803 2.206 6.648 1.823 1.854 4.5 3.07 7.182 2.43l-.174-.73zM9.237 9.875c.416-1.349 1.636-2.557 4.127-3.14l-.17-.73c-2.67.624-4.158 1.974-4.674 3.649l.717.22zm4.127-3.14c.84-.197 1.822-.322 2.961-.354l-.021-.75c-1.18.034-2.213.163-3.11.373l.17.73zm2.961-.354c4.131-.12 6.753.67 8.368 1.8l.43-.615c-1.794-1.254-4.596-2.057-8.82-1.935l.022.75zm8.368 1.8c1.082.756 1.726 1.675 2.073 2.606l.703-.262c-.4-1.072-1.137-2.114-2.347-2.96l-.43.615zm2.073 2.606a5.68 5.68 0 01.041 3.767l.708.249a6.43 6.43 0 00-.047-4.278l-.702.262zm.036 3.784c-.382 1.275-2.004 3.37-4.585 4.592-2.551 1.21-6.033 1.56-10.145-.628l-.353.662c4.325 2.3 8.057 1.953 10.82.644 2.733-1.295 4.526-3.538 4.981-5.055l-.718-.215zm-14.73 3.964c-2.906-1.546-4.337-3.732-4.69-5.992-.355-2.272.372-4.669 1.883-6.63l-.594-.458C7.056 7.552 6.25 10.152 6.64 12.66c.394 2.518 1.989 4.894 5.078 6.538l.353-.662zM9.265 5.913c2.42-3.143 6.82-5.127 11.84-3.633l.215-.718c-5.343-1.59-10.055.524-12.65 3.893l.595.458zm11.84-3.633c.978.291 1.982.715 3.002 1.29l.368-.654a15.35 15.35 0 00-3.155-1.354l-.214.718zm3.002 1.29c.11.062.222.126.333.193l.383-.645c-.116-.07-.232-.136-.348-.202l-.368.654z'
    ></path>
  </svg>
);
