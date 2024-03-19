import { Toaster } from 'react-hot-toast';
import Header from '@/components/_global/Header';
import Footer from '@/components/_global/Footer';
import CartProvider from 'src/HOCs/cart-provider';
import DraftModeInfo from '@/components/ui/DraftModeInfo';
import { draftMode } from 'next/headers';
import { requestAsyncStorage } from 'next/dist/client/components/request-async-storage.external';

const isProduction = process.env.NODE_ENV === 'production';
const isDraftMode = !isProduction && !!requestAsyncStorage.getStore()?.draftMode.isEnabled;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  draftMode().enable();
  return (
    <>
      <CartProvider>
        <Header />
        <main id='main'>{children}</main>
        <Footer />
        {isDraftMode && <DraftModeInfo />}
      </CartProvider>
      <Toaster />
    </>
  );
}
