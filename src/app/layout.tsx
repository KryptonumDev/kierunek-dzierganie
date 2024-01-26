import '@/global/global.scss';
import localFont from 'next/font/local';
import Nav from '@/components/organisms/Nav';
import Footer from '@/components/organisms/Footer';
import Analitics from '@/global/Analitics';
import type { Viewport } from 'next';
import { themeColor } from '@/global/constants';

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
  themeColor: themeColor,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='pl'>
      <body className={`${Lato.className} ${CityStreetWear.variable}`}>
        <Nav />
        <main id='main'>{children}</main>
        <Footer />
        <Analitics />
      </body>
    </html>
  );
}