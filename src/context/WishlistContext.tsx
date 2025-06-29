// src/context/WishlistContext.tsx
"use client";

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// กำหนดหน้าตาของ Context
interface WishlistContextType {
  wishlist: number[]; // เราจะเก็บแค่ ID ของสินค้า
  toggleWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
}

// สร้าง Context พร้อมค่าเริ่มต้น
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// สร้าง Provider Component
export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<number[]>([]);

  // useEffect นี้จะทำงาน "ครั้งเดียว" ตอนที่ Component โหลดในฝั่ง Client
  // เพื่อดึงข้อมูลที่เคยบันทึกไว้จาก localStorage
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('hampback_wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error("Failed to load wishlist from localStorage", error);
    }
  }, []);

  // ฟังก์ชันสำหรับสลับสถานะ (เพิ่ม/ลบ) สินค้าใน Wishlist
  const toggleWishlist = (productId: number) => {
    setWishlist(prevWishlist => {
      const newWishlist = prevWishlist.includes(productId)
        ? prevWishlist.filter(id => id !== productId) // ถ้ามีอยู่แล้ว ให้ลบออก
        : [...prevWishlist, productId]; // ถ้ายังไม่มี ให้เพิ่มเข้าไป

      // บันทึกสถานะใหม่ลงใน localStorage
      localStorage.setItem('hampback_wishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  // ฟังก์ชันสำหรับตรวจสอบว่าสินค้าอยู่ใน Wishlist หรือไม่
  const isInWishlist = (productId: number) => {
    return wishlist.includes(productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

// สร้าง Custom Hook เพื่อให้เรียกใช้งานได้ง่าย
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
