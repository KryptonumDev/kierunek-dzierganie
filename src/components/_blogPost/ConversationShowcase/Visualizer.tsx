'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AudioVisualizer } from 'react-audio-visualize';
import styles from './ConversationShowcase.module.scss';

export default function Visualizer({ audioFile }: { audioFile: { asset: { url: string } } }) {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [hasLoaded, setHasLoaded] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  //Blob file type is needed to work with react-audio-visualize
  useEffect(() => {
    fetch(audioFile.asset.url)
      .then((response) => response.blob())
      .then((blob) => {
        setAudioBlob(blob);
      });
  }, [audioFile]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement && audioBlob) {
      const handleLoadedMetadata = () => {
        setHasLoaded(true);
      };

      audioElement.src = URL.createObjectURL(audioBlob);
      audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [audioBlob]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setCurrentTime(audioRef.current.currentTime);
      } else {
        audioRef.current.play();
        setCurrentTime(audioRef.current.currentTime);
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={styles.cloud}>
      <audio
        ref={audioRef}
        controls
        src={audioFile.asset.url}
        style={{ display: 'none' }}
      />
      {hasLoaded ? (
        <div className={styles.visualizer}>
          <button onClick={handlePlayPause}>{isPlaying ? '<Pause />' : <Play />}</button>
          <div className={styles.audioVisualizer}>
            {audioBlob && (
              <AudioVisualizer
                blob={audioBlob}
                width={372}
                height={42}
                barWidth={2}
                gap={4}
                barColor={'#E5D8D4'}
                barPlayedColor={'#766965'}
                currentTime={currentTime || 0}
              />
            )}
          </div>
          <div className={styles.controls}>
            <>
              <p>
                {String(Math.floor(currentTime / 60)).padStart(2, '00')}:
                {String(Math.floor(currentTime % 60)).padStart(2, '00')}
              </p>
              <p>
                {String(Math.floor((audioRef.current?.duration ?? 0) / 60)).padStart(2, '00')}:
                {String(Math.floor((audioRef.current?.duration ?? 0) % 60)).padStart(2, '00')}
              </p>
            </>
          </div>
        </div>
      ) : (
        <div className={styles.loading}>Ładowanie...</div>
      )}
    </div>
  );
}

function Play() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='25'
      viewBox='0 0 24 25'
      fill='none'
    >
      <path
        fill='#766965'
        d='M21.788 11.127L8.28 2.863a1.5 1.5 0 00-2.075.517A1.487 1.487 0 006 4.13v16.525a1.495 1.495 0 001.5 1.488c.277 0 .548-.076.784-.22l13.503-8.263a1.481 1.481 0 000-2.532v-.001zM7.5 20.636V4.143l13.484 8.25L7.5 20.637z'
      ></path>
    </svg>
  );
}
