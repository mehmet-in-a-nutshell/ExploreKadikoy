import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { GoogleAnalytics } from '@next/third-parties/google';
import { FavoritesProvider } from "../contexts/FavoritesContext";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.explorekadikoy.com'),
  title: {
    template: '%s | Explore Kadıköy',
    default: "Explore Kadıköy - Kadıköy'de Ne Yapılır?",
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' }
    ],
    apple: [
      { url: '/apple-touch-icon.png' }
    ],
  },
  description: "Kadıköy'deki güncel etkinlikler, konserler, tiyatrolar, atölyeler ve rehberleri keşfedin.",
  keywords: "kadıköy, etkinlik, konser, tiyatro, istanbul, moda, yel değirmeni",
  openGraph: {
    title: "Explore Kadıköy - Kadıköy'de Ne Yapılır?",
    description: "Kadıköy'deki güncel etkinlikler, konserler, tiyatrolar ve atölyeleri keşfedin.",
    url: 'https://www.explorekadikoy.com',
    siteName: 'Explore Kadıköy',
    locale: 'tr_TR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body style={{ overflowX: 'hidden', width: '100%', maxWidth: '100vw' }}>
        <FavoritesProvider>
          <Header />
          <div style={{ overflowX: 'hidden', width: '100%', maxWidth: '100vw', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {children}
          </div>
          <Footer />
        </FavoritesProvider>
        <GoogleAnalytics gaId="G-9EDGTLNWZX" />
      </body>
    </html>
  );
}
