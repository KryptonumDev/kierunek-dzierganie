import { Toaster } from 'react-hot-toast';
import Header from '@/components/_global/Header';
import Footer from '@/components/_global/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id='main'>{children}</main>
      <Footer />
      <Toaster />
    </>
  );
}