import type { VideoProvider } from '@/components/ui/VideoPlayer/VideoPlayer.types';

export type Props = {
  alreadySubscribed: boolean;
  course: {
    slug: string;
    name: string;
    _id: string;
    previewGroupMailerLite?: string;
    previewLessons: {
      slug: string;
      title: string;
      _id: string;
    }[];
    reviews: {
      rating: 1 | 2 | 3 | 4 | 5;
      review: string;
      nameOfReviewer: string;
      _id: string;
    }[];
  };
  lesson: {
    title: string;
    _id: string;
    slug: string;
    video: string;
    videoProvider?: VideoProvider;
  };
};

export type FieldValues = {
  email: string;
  privacy: boolean;
  name: string;
};
