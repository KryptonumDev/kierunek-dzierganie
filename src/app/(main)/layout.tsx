import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main id='main'>{children}</main>
      <Footer />
      <Toaster />
    </>
  );
}