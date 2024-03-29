import styles from './Description.module.scss';
import ColumnImageSection, { ColumnImageSectionTypes } from '../ColumnImageSection';

type DescriptionMap = {
  ColumnImageSection: ColumnImageSectionTypes;
};

export type DescriptionTypes = DescriptionMap[keyof DescriptionMap] & { _type: string };

const Description = ({ data }: { data: DescriptionTypes[] }) => (
  <div className={styles.Description}>
    {data?.map((item) => {
      const DescriptionType = item._type as keyof DescriptionMap;
      const componentMap: Record<string, React.ReactNode> = {
        ColumnImageSection: <ColumnImageSection {...(item as ColumnImageSectionTypes)} />,
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
