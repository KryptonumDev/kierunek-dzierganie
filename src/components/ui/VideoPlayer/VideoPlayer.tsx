'use client';

import { useEffect, useRef } from 'react';
import Vimeo from '@u-wave/react-vimeo';
import YouTube, { YouTubeEvent } from 'react-youtube';
import styles from './VideoPlayer.module.scss';
import type { VideoPlayerProps } from './VideoPlayer.types';

const VideoPlayer = ({
  video,
  video_alter,
  autoplay = false,
  speed = true,
  onEnd,
  onTimeUpdate,
  start = 0,
  loop = false,
  provider = 'vimeo',
  leftHanded = false,
}: VideoPlayerProps) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const videoId = leftHanded && video_alter ? video_alter : video;

  useEffect(() => {
    // Initialize BunnyPlayer if needed
    if (provider === 'bunnyNet' && playerRef.current) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@bunnycdn/stream-player@latest/dist/player.min.js';
      document.head.appendChild(script);

      script.onload = () => {
        // @ts-expect-error - BunnyPlayer is loaded from CDN
        const player = new BunnyPlayer(playerRef.current);
        player.init({
          videoId,
          autoplay,
          loop,
          startTime: start,
          apiKey: process.env.NEXT_PUBLIC_BUNNY_API_KEY,
        });

        player.on('timeupdate', () => {
          onTimeUpdate?.(player.currentTime);
        });

        player.on('ended', () => {
          onEnd?.();
        });
      };

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [provider, videoId, autoplay, loop, start, onTimeUpdate, onEnd]);

  if (provider === 'youtube') {
    return (
      <div className={styles['video-container']}>
        <YouTube
          videoId={videoId}
          className={styles.player}
          opts={{
            playerVars: {
              autoplay: autoplay ? 1 : 0,
              loop: loop ? 1 : 0,
              start,
              controls: 1,
              modestbranding: 1,
              rel: 0,
            },
          }}
          onEnd={onEnd}
          onStateChange={(event: YouTubeEvent) => {
            if (event.target.getCurrentTime && onTimeUpdate) {
              onTimeUpdate(event.target.getCurrentTime());
            }
          }}
        />
      </div>
    );
  }

  if (provider === 'bunnyNet') {
    return (
      <div className={styles['video-container']}>
        <iframe
          src={`https://iframe.mediadelivery.net/embed/${process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID}/${videoId}?autoplay=${autoplay}&loop=${loop}&muted=false&preload=true&responsive=true`}
          loading='lazy'
          className={styles.player}
          allow='accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;'
          allowFullScreen
        />
      </div>
    );
  }

  // Default to Vimeo
  return (
    <div className={styles['video-container']}>
      <Vimeo
        video={videoId}
        responsive
        className={styles.player}
        autoplay={autoplay}
        loop={loop}
        speed={speed}
        start={start}
        onTimeUpdate={({ seconds }) => onTimeUpdate?.(seconds)}
        onEnd={onEnd}
      />
    </div>
  );
};

export default VideoPlayer;
