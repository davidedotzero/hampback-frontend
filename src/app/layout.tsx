// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // หรือฟอนต์อื่นที่คุณเลือก
import "./globals.css";


// 1. Import Navbar และ Footer เข้ามา
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { WishlistProvider } from "@/context/WishlistContext";

const inter = Inter({ subsets: ["latin"] });

// --- SEO Optimized Metadata Template ---
export const metadata: Metadata = {
  // Title template allows child pages to set their own title while keeping the brand name.
  title: {
    template: '%s | Hampback Music Gear', // %s will be replaced by the child page's title
    default: 'Hampback - High Quality Music Gear & Accessories', // Default title for pages without a specific one
  },
  description: "Explore premium musical instruments, guitar care products, and accessories from Hampback. Quality you can hear.",
  // Optional: Add more default metadata for social sharing
  openGraph: {
      type: 'website',
      locale: 'th_TH', // or 'th_TH'
      url: 'https://hampback.vercel.app', // <-- แก้ไขเป็นโดเมนจริงของคุณ
      siteName: 'Hampback Music Gear',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WishlistProvider>
          <div className="flex flex-col min-h-screen">
            {/* 2. วาง Navbar ไว้บนสุด */}
            <Navbar />

            {/* 3. {children} คือเนื้อหาของแต่ละหน้าที่จะเปลี่ยนไป */}
            <main className="flex-grow">
              {children}
            </main>

            {/* 4. วาง Footer ไว้ล่างสุด */}
            <Footer />
          </div>
        </WishlistProvider>
      </body>
    </html>
  );
}
