import Footer from '@/components/_landing/Footer';
import Nav from '@/components/_landing/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main id='main'>{children}</main>
      <ToastContainer className='toast' limit={10} />
      <Footer />
    </>
  );
}
