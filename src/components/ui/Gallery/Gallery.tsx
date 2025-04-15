'use client';
import type { ImgType } from '@/global/types';
import styles from './Gallery.module.scss';
import type { GalleryTypes } from './Gallery.types';
import Img from '../image';
import { useState } from 'react';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import type { VideoProvider } from '../VideoPlayer/VideoPlayer.types';

const PlayIcon = () => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <circle
      cx='12'
      cy='12'
      r='12'
      fill='white'
      fillOpacity='0.8'
    />
    <path
      d='M16 12L10 15.464V8.53599L16 12Z'
      fill='#1A1A1A'
    />
  </svg>
);

const gallerySwitch = (data: ImgType | string, size: 'big' | 'small', videoProvider?: VideoProvider) => ({
  image: (
    <Img
      data={data as ImgType}
      sizes={size === 'big' ? '(max-width: 840px) 100vw, 50vw' : '80px'}
    />
  ),
  video:
    size === 'big' ? (
      <VideoPlayer
        video={data as string}
        provider={videoProvider}
        autoplay={false}
      />
    ) : (
      <div className={styles.videoThumbnail}>
        <div className={styles.playIconWrapper}>
          <PlayIcon />
        </div>
      </div>
    ),
});

const Gallery = ({ images }: GalleryTypes) => {
  const [selectedImage, setSelectedImage] = useState(0);
  return (
    <div className={styles['gallery']}>
      {
        gallerySwitch(
          images[selectedImage]!.data,
          'big',
          images[selectedImage]!.type === 'video' ? images[selectedImage]!.videoProvider : undefined
        )[images[selectedImage]!.type as 'image' | 'video']
      }
      <div className={styles['gallery-grid']}>
        {images.map((el, index) => {
          if (index === selectedImage) return null;
          return (
            <button
              onClick={() => setSelectedImage(index)}
              key={index}
              aria-label={`Zdjęcie numer ${index}`}
            >
              {
                gallerySwitch(el.data, 'small', el.type === 'video' ? el.videoProvider : undefined)[
                  el.type as 'image' | 'video'
                ]
              }
            </button>
          );
        })}
      </div>
      {/* TODO: change aria-label of buttons */}
      {/* TODO: add complexity page */}
      {/* TODO: add course in bundle badge */}
      {/* TODO: add arrows */}
    </div>
  );
};

export default Gallery;
