import type { MetadataRoute } from 'next';
import { BACKGROUND_COLOR, THEME_COLOR } from '@/global/constants';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kierunek Dzierganie',
    short_name: 'Kierunek Dzierganie',
    description: 'Kierunek Dzierganie',
    start_url: '/',
    display: 'standalone',
    background_color: BACKGROUND_COLOR,
    theme_color: THEME_COLOR,
    icons: [
      {
        src: '/kierunek-dzierganie-logo.png',
        type: 'image/png',
      },
    ],
  };
}
