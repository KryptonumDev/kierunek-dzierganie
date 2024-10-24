import { MaterialsPackage } from '@/global/types';
import { Fragment } from 'react';
import AdditionalMaterials, { AdditionalMaterialsTypes } from '../AdditionalMaterials';
import MaterialsGroups, { MaterialsGroupsTypes } from '../MaterialsGroups';
import PartnerSales, { PartnerSalesTypes } from '../PartnerSales';
import RelatedMaterials, { RelatedMaterialsTypes } from '../RelatedMaterials';
import styles from './RequiredMaterials.module.scss';

type RequiredMaterialsMap = {
  materialsGroups: MaterialsGroupsTypes;
  dedicatedPackage: RelatedMaterialsTypes;
  partnerSales: PartnerSalesTypes;
  additionalMaterials: AdditionalMaterialsTypes;
};

const RequiredMaterials = ({ materialsPackage }: { materialsPackage: MaterialsPackage }) => {
  return (
    <div className={styles['RequiredMaterials']}>
      {materialsPackage?.map((item, index) => {
        const RequiredMaterialType = item._type as keyof RequiredMaterialsMap;
        const componentMap: Record<string, React.ReactNode> = {
          materialsGroups: <MaterialsGroups {...(item as MaterialsGroupsTypes)} />,
          dedicatedPackage: <RelatedMaterials {...(item as RelatedMaterialsTypes)} />,
          partnerSales: <PartnerSales {...(item as PartnerSalesTypes)} />,
          additionalMaterials: <AdditionalMaterials {...(item as AdditionalMaterialsTypes)} />,
        };
        const DynamicComponent = componentMap[RequiredMaterialType];

        if (!DynamicComponent) {
          return null;
        }
        return <Fragment key={index}>{DynamicComponent}</Fragment>;
      })}
    </div>
  );
};

export default RequiredMaterials;
