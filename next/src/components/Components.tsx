import Benefits, { Benefits_Query, type BenefitsProps } from '@/components/_global/Benefits';
import Bonuses, { Bonuses_Query, type BonusesProps } from '@/components/_global/Bonuses';
import Community, { Community_Query, type CommunityProps } from '@/components/_global/Community';
import ContactForm, { ContactForm_Query, type ContactFormProps } from '@/components/_global/ContactForm';
import CourseModules, { CourseModules_Query, type CourseModulesProps } from '@/components/_global/CourseModules';
import CtaSection, { CtaSection_Query, type CtaSectionProps } from '@/components/_global/CtaSection';
import CustomerCaseStudy, {
  CustomerCaseStudy_Query,
  type CustomerCaseStudyProps,
} from '@/components/_global/CustomerCaseStudy';
import Divider, { Divider_Query } from '@/components/_global/Divider';
import Faq, { Faq_Query, type FaqTypes } from '@/components/_global/Faq';
import HeroBackgroundImg, {
  HeroBackgroundImg_Query,
  type HeroBackgroundImgProps,
} from '@/components/_global/HeroBackgroundImg';
import HeroColumn, { HeroColumn_Query, type HeroColumnProps } from '@/components/_global/HeroColumn';
import HeroSimple, { HeroSimpleTypes, HeroSimple_Query } from '@/components/_global/HeroSimple';
import ImageShowcase, { ImageShowcase_Query, type ImageShowcaseProps } from '@/components/_global/ImageShowcase';
import Introduction, { Introduction_Query, type IntroductionProps } from '@/components/_global/Introduction';
import Newsletter, { Newsletter_Query, type NewsletterProps } from '@/components/_global/Newsletter';
import Opinions, { Opinions_Query, type OpinionsProps } from '@/components/_global/Opinions';
import Partners, { Partners_Query, type PartnersProps } from '@/components/_global/Partners';
import ProductOptionsSection, {
  ProductOptionsSection_Query,
  type ProductOptionsSectionProps,
} from '@/components/_global/ProductOptionsSection';
import Reviews, { Reviews_Query, type ReviewsProps } from '@/components/_global/Reviews';
import SimpleCtaSection, {
  SimpleCtaSection_Query,
  type SimpleCtaSectionProps,
} from '@/components/_global/SimpleCtaSection';
import StepList, { StepList_Query, type StepListProps } from '@/components/_global/StepList';
import TabSection, { TabSection_Query, type TabSectionProps } from '@/components/_global/TabSection';
import TileList, { TileList_Query, type TileListProps } from '@/components/_global/TileList';
import TilesFeatures, { TilesFeatures_Query, type TilesFeaturesProps } from '@/components/_global/TilesFeatures';
import TilesGrid, { TilesGrid_Query, type TilesGridProps } from '@/components/_global/TilesGrid';
import TilesIcon, { TilesIcon_Query, type TilesIconProps } from '@/components/_global/TilesIcon';
import TilesIndicated, { TilesIndicated_Query, type TilesIndicatedProps } from '@/components/_global/TilesIndicated';
import TilesSticky, { TilesSticky_Query, type TilesStickyProps } from '@/components/_global/TilesSticky';
import WordsCollection, {
  WordsCollection_Query,
  type WordsCollectionProps,
} from '@/components/_global/WordsCollection';
import TeamShowcase, { TeamShowcaseTypes, TeamShowcase_Query } from './_about/TeamShowcase';
import CompaniesShowcase, { CompaniesShowcase_Query, type CompaniesShowcaseTypes } from './_global/CompaniesShowcase';
import LatestBlogEntries, { LatestBlogEntries_Query, type LatestBlogEntriesTypes } from './_global/LatestBlogEntries';
import LogoSection, { LogoSectionTypes, LogoSection_Query } from './_global/LogoSection';
import TilesGallery, { TilesGallery_Query, type TilesGalleryProps } from './_global/TilesGallery';

export type ComponentMap = {
  HeroBackgroundImg: HeroBackgroundImgProps;
  HeroColumn: HeroColumnProps;
  HeroSimple: HeroSimpleTypes;
  Benefits: BenefitsProps;
  Faq: FaqTypes;
  Opinions: OpinionsProps;
  CtaSection: CtaSectionProps;
  SimpleCtaSection: SimpleCtaSectionProps;
  CourseModules: CourseModulesProps;
  ImageShowcase: ImageShowcaseProps;
  Bonuses: BonusesProps;
  TileList: TileListProps;
  TilesGrid: TilesGridProps;
  TilesSticky: TilesStickyProps;
  TilesFeatures: TilesFeaturesProps;
  TilesGallery: TilesGalleryProps;
  Community: CommunityProps;
  Reviews: ReviewsProps;
  Introduction: IntroductionProps;
  ContactForm: ContactFormProps;
  TabSection: TabSectionProps;
  TilesIndicated: TilesIndicatedProps;
  TilesIcon: TilesIconProps;
  StepList: StepListProps;
  Newsletter: NewsletterProps;
  CustomerCaseStudy: CustomerCaseStudyProps;
  WordsCollection: WordsCollectionProps;
  Partners: PartnersProps;
  LatestBlogEntries: LatestBlogEntriesTypes;
  CompaniesShowcase: CompaniesShowcaseTypes;
  TeamShowcase: TeamShowcaseTypes;
  LogoSection: LogoSectionTypes;
  ProductOptionsSection: ProductOptionsSectionProps;
};

export type ComponentProps = ComponentMap[keyof ComponentMap] & { _type: string };

export const getComponentMap = (item: ComponentProps, index: number) => {
  return {
    HeroBackgroundImg: (
      <HeroBackgroundImg
        {...(item as HeroBackgroundImgProps)}
        aboveTheFold={Boolean(index === 0)}
      />
    ),
    HeroColumn: (
      <HeroColumn
        {...(item as HeroColumnProps)}
        index={index}
      />
    ),
    HeroSimple: <HeroSimple {...(item as HeroSimpleTypes)} />,
    Benefits: <Benefits {...(item as BenefitsProps)} />,
    Faq: <Faq {...(item as FaqTypes)} />,
    Opinions: <Opinions {...(item as OpinionsProps)} />,
    CtaSection: <CtaSection {...(item as CtaSectionProps)} />,
    SimpleCtaSection: <SimpleCtaSection {...(item as SimpleCtaSectionProps)} />,
    CourseModules: <CourseModules {...(item as CourseModulesProps)} />,
    ImageShowcase: <ImageShowcase {...(item as ImageShowcaseProps)} />,
    Bonuses: <Bonuses {...(item as BonusesProps)} />,
    TileList: <TileList {...(item as TileListProps)} />,
    TilesGrid: <TilesGrid {...(item as TilesGridProps)} />,
    TilesGallery: <TilesGallery {...(item as TilesGalleryProps)} />,
    TilesSticky: <TilesSticky {...(item as TilesStickyProps)} />,
    TilesFeatures: <TilesFeatures {...(item as TilesFeaturesProps)} />,
    Community: <Community {...(item as CommunityProps)} />,
    Reviews: <Reviews {...(item as ReviewsProps)} />,
    Introduction: <Introduction {...(item as IntroductionProps)} />,
    ContactForm: (
      <ContactForm
        {...(item as ContactFormProps)}
        aboveTheFold={index === 0}
      />
    ),
    TabSection: <TabSection {...(item as TabSectionProps)} />,
    TilesIndicated: <TilesIndicated {...(item as TilesIndicatedProps)} />,
    TilesIcon: (
      <TilesIcon
        {...(item as TilesIconProps)}
        index={index}
      />
    ),
    Divider: <Divider />,
    StepList: <StepList {...(item as StepListProps)} />,
    Newsletter: (
      <Newsletter
        {...(item as NewsletterProps)}
        index={index}
      />
    ),
    CustomerCaseStudy: (
      <CustomerCaseStudy
        {...(item as CustomerCaseStudyProps)}
        index={index}
      />
    ),
    WordsCollection: (
      <WordsCollection
        {...(item as WordsCollectionProps)}
        index={index}
      />
    ),
    Partners: (
      <Partners
        {...(item as PartnersProps)}
        index={index}
      />
    ),
    LatestBlogEntries: <LatestBlogEntries {...(item as LatestBlogEntriesTypes)} />,
    CompaniesShowcase: <CompaniesShowcase {...(item as CompaniesShowcaseTypes)} />,
    TeamShowcase: <TeamShowcase {...(item as TeamShowcaseTypes)} />,
    LogoSection: <LogoSection {...(item as LogoSectionTypes)} />,
    ProductOptionsSection: <ProductOptionsSection {...(item as ProductOptionsSectionProps)} />,
  };
};

const Components = ({ data }: { data: ComponentProps[] }) => {
  return data?.map((item, index) => {
    const componentType = item._type as keyof ComponentMap;
    const componentMap: Record<string, React.ReactNode> = getComponentMap(item, index);
    const DynamicComponent = componentMap[componentType];
    if (!DynamicComponent) {
      return null;
    }
    return DynamicComponent;
  });
};

export default Components;

export const ComponentsLits = `
    ${HeroBackgroundImg_Query}
    ${HeroColumn_Query}
    ${HeroSimple_Query(false)}
    ${Benefits_Query}
    ${Opinions_Query}
    ${TileList_Query}
    ${CtaSection_Query}
    ${SimpleCtaSection_Query}
    ${CourseModules_Query}
    ${ImageShowcase_Query(false)}
    ${Bonuses_Query}
    ${TilesGrid_Query}
    ${TilesSticky_Query}
    ${TilesFeatures_Query}
    ${TilesGallery_Query}
    ${Community_Query}
    ${Reviews_Query}
    ${Introduction_Query(false)}
    ${ContactForm_Query}
    ${TabSection_Query}
    ${TilesIndicated_Query}
    ${TilesIcon_Query}
    ${Divider_Query}
    ${StepList_Query}
    ${Newsletter_Query}
    ${CustomerCaseStudy_Query}
    ${WordsCollection_Query}
    ${Partners_Query}
    ${Faq_Query}
    ${LatestBlogEntries_Query(false)}
    ${CompaniesShowcase_Query}
    ${TeamShowcase_Query}
    ${LogoSection_Query(false)}
    ${ProductOptionsSection_Query}
`;

export const Components_Query = /* groq */ `
  content[] {
    _type,
    ${ComponentsLits}
  },
`;
