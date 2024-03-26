import { Toaster } from 'react-hot-toast';
import Header from '@/components/_global/Header';
import Footer from '@/components/_global/Footer';
import CartProvider from 'src/HOCs/cart-provider';
import PreviewDeploymentInfo from '@/components/ui/PreviewDeploymentInfo';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CartProvider>
        <Header />
        <main id='main'>{children}</main>
        <Footer />
        <PreviewDeploymentInfo />
      </CartProvider>
      <Toaster />
    </>
  );
}
