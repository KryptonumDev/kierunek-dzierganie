import '@/global/global.scss';
import localFont from 'next/font/local';
import Analitics from '@/global/Analitics';
import { LOCALE, THEME_COLOR } from '@/global/constants';
import SchemaOrganization from '@/global/Schema/Ogranization';
import type { Viewport } from 'next';

const Lato = localFont({
  src: [
    {
      path: '../assets/fonts/Lato-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Lato-LightItalic.woff2',
      weight: '300',
      style: 'italic',
    },
  ],
  display: 'swap',
  fallback: ['sans-serif'],
});

const CityStreetWear = localFont({
  src: [
    {
      path: '../assets/fonts/CityStreetwear-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  display: 'swap',
  fallback: ['sans-serif'],
  variable: '--font-city-streetwear',
});

export const viewport: Viewport = {
  themeColor: THEME_COLOR,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={LOCALE}>
      <head>
        <SchemaOrganization />
      </head>
      <body className={`${Lato.className} ${CityStreetWear.variable}`}>
        {children}
        <Analitics />
      </body>
    </html>
  );
}
