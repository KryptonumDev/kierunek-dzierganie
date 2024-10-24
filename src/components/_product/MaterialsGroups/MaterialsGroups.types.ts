import { ProductReference } from '@/global/types';

export type MaterialsGroupsTypes = {
  _type: 'materialsGroups';
  heading: string;
  listParagraph: string;
  materialsGroupsList: { title: string; materialsList: { name: string; materialRef?: ProductReference }[] }[];
};
