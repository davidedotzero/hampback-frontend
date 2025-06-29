// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // หรือฟอนต์อื่นที่คุณเลือก
import "./globals.css";


// 1. Import Navbar และ Footer เข้ามา
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { WishlistProvider } from "@/context/WishlistContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hampback - High Quality Music Gear",
  description: "Explore premium musical instruments and accessories.",
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
