import Nav from '@/components/_landing/Header';
import Footer from '@/components/_landing/Footer';
import SchemaOrganization from '@/global/Schema/Ogranization';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <SchemaOrganization />
      </head>
      <Nav />
      <main id='main'>{children}</main>
      <Footer />
    </>
  );
}
