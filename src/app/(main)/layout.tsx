import { Toaster } from 'react-hot-toast';
import Header from '@/components/_global/Header';
import Footer from '@/components/_global/Footer';
import CartProvider from 'src/HOCs/cart-provider';
import SchemaOrganization from '@/global/Schema/Ogranization';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <SchemaOrganization />
      </head>
      <CartProvider>
        <Header />
        <main id='main'>{children}</main>
        <Footer />
      </CartProvider>
      <Toaster />
    </>
  );
}
