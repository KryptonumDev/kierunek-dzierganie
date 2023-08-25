import './globals.scss'
import localFont from 'next/font/local'
import Nav from '@/components/organisms/Nav'
import Footer from '@/components/organisms/Footer'
import GlobalScript from './global'
 
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
  fallback: [ "sans-serif" ]
})

const CityStreetwear = localFont({
  src: '../assets/fonts/CityStreetwear-Regular.woff2',
  display: 'swap',
  variable: '--font-city-streetwear',
  fallback: [ "sans-serif" ]
})

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body className={`body ${Lato.className} ${CityStreetwear.variable}`}>
        <Nav />
        {children}
        <Footer />
        <GlobalScript />
      </body>
    </html>
  )
}