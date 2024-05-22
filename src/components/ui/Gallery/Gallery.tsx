'use client';
import type { ImgType } from '@/global/types';
import styles from './Gallery.module.scss';
import type { GalleryTypes } from './Gallery.types';
import Img from '../image';
import { useState } from 'react';

const gallerySwitch = (data: ImgType | string, size: 'big' | 'small') => ({
  image: (
    <Img
      data={data as ImgType}
      sizes={size === 'big' ? '(max-width: 840px) 100vw, 50vw' : '80px'}
    />
  ),
  video: (
    <iframe
      src={data as string}
      style={{ aspectRatio: '16/9', width: '100%', height: 'auto', borderRadius: '4px' }}
    />
  ),
});

const Gallery = ({ images }: GalleryTypes) => {
  const [selectedImage, setSelectedImage] = useState(0);
  return (
    <div className={styles['gallery']}>
      {gallerySwitch(images[selectedImage]!.data, 'big')[images[selectedImage]!.type as 'image' | 'video']}
      <div className={styles['gallery-grid']}>
        {images.map((el, index) => {
          if (index === selectedImage) return null;
          return (
            <button
              onClick={() => setSelectedImage(index)}
              key={index}
              aria-label={`Zdjęcie numer ${index}`}
            >
              {gallerySwitch(el.data, 'small')[el.type as 'image' | 'video']}
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
