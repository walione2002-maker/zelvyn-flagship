import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans, Syne } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { GuestAuthModal } from "@/components/GuestAuthModal";
import { SearchModal } from "@/components/SearchModal";
import { ToastContainer } from "@/components/ToastContainer";

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-syne",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "ZELVYN — KEEPIN' IT REAL | Luxury Monochrome Footwear",
  description:
    "Unisex luxury streetwear footwear flagship. Boys & Girls sneakers, joggers, loafers, grippers, and molded slides delivered across Pakistan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="flex min-h-screen flex-col bg-[#050505] text-[#F5F5F7] antialiased">
        <StoreProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <GuestAuthModal />
          <SearchModal />
          <ToastContainer />
        </StoreProvider>
      </body>
    </html>
  );
}
