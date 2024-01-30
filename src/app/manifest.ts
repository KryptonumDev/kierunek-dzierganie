import type { MetadataRoute } from 'next';
import { backgroundColor, themeColor } from '@/global/constants';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kierunek Dzierganie',
    short_name: 'Kierunek Dzierganie',
    description: 'Kierunek Dzierganie',
    start_url: '/',
    display: 'standalone',
    background_color: backgroundColor,
    theme_color: themeColor,
    icons: [
      {
        src: '/kierunek-dzierganie-logo.png',
        type: 'image/png',
      },
    ],
  };
}