import { ComponentMap, getComponentMap } from '@/components/Components';
import { Fragment } from 'react';
import CtaHeading, { CtaHeadingTypes } from '../CtaHeading';
import DiscountCta, { DiscountCtaTypes } from '../DiscountCta';
import DiscountHero, { DiscountHeroTypes } from '../DiscountHero';
import ImageHeading, { ImageHeadingTypes } from '../ImageHeading';
import TimerBox, { TimerBoxTypes } from '../TimerBox';
import type { SectionPickerTypes } from './SectionPicker.types';

type DiscountCourseMap = ComponentMap & {
  discountHero: DiscountHeroTypes;
  timerBox: TimerBoxTypes;
  imageHeading: ImageHeadingTypes;
  ctaHeading: CtaHeadingTypes;
  discountCta: DiscountCtaTypes;
};

export type DiscountCourseComponentProps = DiscountCourseMap[keyof DiscountCourseMap] & { _type: string };

const SectionPicker = ({ data, discountCourse, discountCode, expirationDate }: SectionPickerTypes) => {
  return (
    <>
      {data?.map((item, index) => {
        const DiscountCourseType = item._type as keyof DiscountCourseMap;
        const componentMap: Record<string, React.ReactNode> = {
          ...getComponentMap(item, index),
          discountHero: <DiscountHero {...({ ...item, index } as DiscountHeroTypes)} />,
          timerBox: (
            <TimerBox {...({ ...item, index, discountCourse, discountCode, expirationDate } as TimerBoxTypes)} />
          ),
          imageHeading: <ImageHeading {...({ ...item, index, expirationDate } as ImageHeadingTypes)} />,
          ctaHeading: <CtaHeading {...({ ...item, index, course: discountCourse.course } as CtaHeadingTypes)} />,
          discountCta: (
            <DiscountCta
              {...({
                ...item,
                index,
                discountPrice:
                  (discountCourse.course.discount || discountCourse.course.price) - discountCourse.discount,
                course: discountCourse.course,
              } as DiscountCtaTypes)}
            />
          ),
        };
        const DynamicComponent = componentMap[DiscountCourseType];

        if (!DynamicComponent) {
          return null;
        }
        return <Fragment key={index}>{DynamicComponent}</Fragment>;
      })}
    </>
  );
};

export default SectionPicker;
