import { Fragment } from 'react';
import styles from './Description.module.scss';
import ColumnImageSection, { type ColumnImageSectionTypes } from '../ColumnImageSection';
import TextSection, { type TextSectionTypes } from '../TextSection';
import OrderedList, { type OrderedListTypes } from '../OrderedList';
import Standout, { type StandoutTypes } from '../Standout';
import UnorderedList, { UnorderedListTypes } from '../UnorderedList';

type DescriptionMap = {
  ColumnImageSection: ColumnImageSectionTypes;
  TextSection: TextSectionTypes;
  OrderedList: OrderedListTypes;
  UnorderedList: UnorderedListTypes;
  Standout: StandoutTypes;
};

export type DescriptionTypes = DescriptionMap[keyof DescriptionMap] & { _type: string };

const Description = ({ data }: { data: DescriptionTypes[] }) => (
  <div className={styles.Description}>
    {data?.map((item, index) => {
      const DescriptionType = item._type as keyof DescriptionMap;
      const componentMap: Record<string, React.ReactNode> = {
        ColumnImageSection: <ColumnImageSection {...(item as ColumnImageSectionTypes)} />,
        TextSection: <TextSection {...(item as TextSectionTypes)} />,
        OrderedList: <OrderedList {...(item as OrderedListTypes)} />,
        UnorderedList: <UnorderedList {...(item as UnorderedListTypes)} />,
        Standout: <Standout {...(item as StandoutTypes)} />,
      };
      const DynamicComponent = componentMap[DescriptionType];
      if (!DynamicComponent) {
        return null;
      }
      return <Fragment key={index}>{DynamicComponent}</Fragment>;
    })}
  </div>
);

export default Description;
