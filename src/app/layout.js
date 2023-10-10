import '@/global/global.scss'
import localFont from 'next/font/local'
import Nav from '@/components/organisms/Nav'
import Footer from '@/components/organisms/Footer'
import Script from 'next/script'
 
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
        <main id="main">
          {children}
        </main>
        <Footer />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-F5CD13WL6R" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-F5CD13WL6R');
          `}
        </Script>
        <Script id="fb-pixel">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '106002735936658');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=106002735936658&ev=PageView&noscript=1" />
        </noscript>
      </body>
    </html>
  )
}