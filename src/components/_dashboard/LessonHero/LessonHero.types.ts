import type { CoursesProgress, Chapter, File, Course } from '@/global/types';
import type { VideoProvider } from '@/components/ui/VideoPlayer/VideoPlayer.types';

export type Props = {
  course: Course;
  lesson: {
    title: string;
    _id: string;
    slug: string;
    video: string;
    video_alter: string;
    lengthInMinutes: number;
    files: File[];
    files_alter: File[];
    videoProvider?: VideoProvider;
  };
  left_handed: boolean;
  progress: CoursesProgress;
  auto_play: boolean;
  currentChapterIndex: number;
  currentLessonIndex: number;
  currentChapter: Chapter;
  id: string;
};
