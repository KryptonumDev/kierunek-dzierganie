import type { CoursePageQueryProps } from '@/global/types';
import type { VideoProvider } from '@/components/ui/VideoPlayer/VideoPlayer.types';

export type HeroVirtualTypes = {
  course: CoursePageQueryProps['product'] & {
    videoProvider?: VideoProvider;
  };
  alreadyBought: boolean;
  previewLessons?: {
    slug: string;
  };
};
