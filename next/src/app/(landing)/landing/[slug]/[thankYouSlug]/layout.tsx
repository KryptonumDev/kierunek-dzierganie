import Footer from '@/components/_landing/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main id='main'>{children}</main>
      <ToastContainer className='toast' />
      <Footer title='Kierunek Dzierganie' />
    </>
  );
}
