export type VideoProvider = 'vimeo' | 'youtube' | 'bunnyNet';

export interface VideoPlayerProps {
  video: string;
  video_alter?: string;
  autoplay?: boolean;
  speed?: boolean;
  onEnd?: () => void;
  onTimeUpdate?: (seconds: number) => void;
  start?: number;
  loop?: boolean;
  provider?: VideoProvider;
  leftHanded?: boolean;
  libraryId?: string;
  libraryApiKey?: string;
}

export interface YouTubePlayerProps extends VideoPlayerProps {
  provider: 'youtube';
}

export interface VimeoPlayerProps extends VideoPlayerProps {
  provider: 'vimeo';
}

export interface BunnyNetPlayerProps extends VideoPlayerProps {
  provider: 'bunnyNet';
  libraryId: string;
  libraryApiKey: string;
}
