// src/components/Hero.tsx
import Image from 'next/image';

// กำหนด Type สำหรับ props ที่จะรับเข้ามา
interface HeroProps {
  imageUrl: string | null;
}

export default function Hero({ imageUrl }: HeroProps) {
  // ถ้าไม่มี URL ของรูปภาพ ก็ไม่ต้องแสดงผล
  if (!imageUrl) {
    return null;
  }

  return (
    <section className="relative w-full h-[60vh] min-h-[400px] max-h-[700px] text-white">
      {/* ใช้ Next.js Image component เป็นพื้นหลัง */}
      <Image
        src={imageUrl}
        alt="Hero background"
        fill
        style={{ objectFit: 'cover' }}
        priority // บอก Next.js ให้โหลดรูปนี้ก่อนเพื่อประสิทธิภาพ
        className="-z-10" // ทำให้รูปอยู่ด้านหลังสุด
      />
      
      {/* Overlay สีดำโปร่งแสง */}
      <div className="absolute inset-0 bg-opacity-40" />
      
      {/* Container สำหรับข้อความ จะต้องเป็น relative เพื่อให้ลอยอยู่เหนือ Overlay */}
      <div className="relative h-full flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
          Quality You Can Hear
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl drop-shadow-md">
          Discover premium care products for your musical instruments.
        </p>
        <button className="mt-8 bg-purple-600 hover:bg-purple-700 font-bold py-3 px-8 rounded-lg transition-colors shadow-lg">
          Shop Now
        </button>
      </div>
    </section>
  );
}
