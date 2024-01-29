import Footer from '@/components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main id='main'>{children}</main>
      <Footer />
    </>
  );
}