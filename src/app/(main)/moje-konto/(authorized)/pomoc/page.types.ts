import { TabsTypes } from '@/components/_dashboard/Tabs';
import type { HeroSimpleTypes } from '@/components/_global/HeroSimple';

export type SupportPage_QueryTypes = {
  HeroSimple: HeroSimpleTypes;
} & TabsTypes;
