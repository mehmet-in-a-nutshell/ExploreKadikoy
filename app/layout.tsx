import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "ExploreKadikoy - Kadıköy'de Ne Yapılır?",
  description: "Kadıköy'deki güncel etkinlikler, konserler, tiyatrolar, atölyeler ve rehberleri keşfedin.",
  keywords: "kadıköy, etkinlik, konser, tiyatro, istanbul, moda, yel değirmeni",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
