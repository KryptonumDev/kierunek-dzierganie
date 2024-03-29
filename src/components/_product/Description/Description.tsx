import styles from './Description.module.scss';
import ColumnImageSection, { type ColumnImageSectionTypes } from '../ColumnImageSection';
import TextSection, { type TextSectionTypes } from '../TextSection';

type DescriptionMap = {
  ColumnImageSection: ColumnImageSectionTypes;
  TextSection: TextSectionTypes;
};

export type DescriptionTypes = DescriptionMap[keyof DescriptionMap] & { _type: string };

const Description = ({ data }: { data: DescriptionTypes[] }) => (
  <div className={styles.Description}>
    {data?.map((item) => {
      const DescriptionType = item._type as keyof DescriptionMap;
      const componentMap: Record<string, React.ReactNode> = {
        ColumnImageSection: <ColumnImageSection {...(item as ColumnImageSectionTypes)} />,
        TextSection: <TextSection {...(item as TextSectionTypes)} />,
      };
      const DynamicComponent = componentMap[DescriptionType];
      if (!DynamicComponent) {
        return null;
      }
      return DynamicComponent;
    })}
  </div>
);

export default Description;
