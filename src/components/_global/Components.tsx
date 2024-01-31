import Faq, { Faq_Query, type FaqProps } from '@/components/_global/Faq';
import Opinions, { Opinions_Query, type OpinionsProps } from '@/components/_global/Opinions';
import TileList, { TileList_Query, type TileListProps } from '@/components/_global/TileList';
import CtaSection, { CtaSection_Query, type CtaSectionProps } from '@/components/_global/CtaSection';
import SimpleCtaSection, {
  SimpleCtaSection_Query,
  type SimpleCtaSectionProps,
} from '@/components/_global/SimpleCtaSection';
import HeroBackgroundImg, {
  HeroBackgroundImg_Query,
  type HeroBackgroundImgProps,
} from '@/components/_global/HeroBackgroundImg';
import Benefits, { Benefits_Query, type BenefitsProps } from '@/components/_global/Benefits';
import CourseModules, { CourseModules_Query, type CourseModulesProps } from '@/components/_global/CourseModules';
import ImageShowcase, { ImageShowcase_Query, type ImageShowcaseProps } from '@/components/_global/ImageShowcase';
import Bonuses, { Bonuses_Query, type BonusesProps } from '@/components/_global/Bonuses';

type ComponentMap = {
  HeroBackgroundImg: HeroBackgroundImgProps;
  Benefits: BenefitsProps;
  Faq: FaqProps;
  Opinions: OpinionsProps;
  CtaSection: CtaSectionProps;
  SimpleCtaSection: SimpleCtaSectionProps;
  CourseModules: CourseModulesProps;
  ImageShowcase: ImageShowcaseProps;
  Bonuses: BonusesProps;
  TileList: TileListProps;
};

export type ComponentProps = ComponentMap[keyof ComponentMap] & { _type: string };

const Components = ({ data, index }: { data: ComponentProps; index: number }) => {
  const componentType = data._type as keyof ComponentMap;
  const Component = {
    HeroBackgroundImg: (
      <HeroBackgroundImg
        {...(data as HeroBackgroundImgProps)}
        aboveTheFold={Boolean(index === 0)}
      />
    ),
    Benefits: <Benefits {...(data as BenefitsProps)} />,
    Faq: <Faq {...(data as FaqProps)} />,
    Opinions: <Opinions {...(data as OpinionsProps)} />,
    CtaSection: <CtaSection {...(data as CtaSectionProps)} />,
    SimpleCtaSection: <SimpleCtaSection {...(data as SimpleCtaSectionProps)} />,
    CourseModules: <CourseModules {...(data as CourseModulesProps)} />,
    ImageShowcase: <ImageShowcase {...(data as ImageShowcaseProps)} />,
    Bonuses: <Bonuses {...(data as BonusesProps)} />,
    TileList: <TileList {...(data as TileListProps)} />,
  }[componentType] as React.ReactNode;
  return Component;
};

export default Components;

const Componenets_Query = /* groq */ `
  content[] {
    ${HeroBackgroundImg_Query}
    ${Benefits_Query}
    ${Faq_Query}
    ${Opinions_Query}
    ${TileList_Query}
    ${CtaSection_Query}
    ${SimpleCtaSection_Query}
    ${CourseModules_Query}
    ${ImageShowcase_Query}
    ${Bonuses_Query}
  },
`;

export { Componenets_Query };
