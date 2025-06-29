// src/components/product/ProductView.tsx
"use client"; // ระบุว่าเป็น Client Component เพราะต้องมีการโต้ตอบ (คลิกเปลี่ยนรูป)

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/types/product';
import ProductVideo from './video/ProductVideo';
import { sanitizeHtml } from '@/lib/sanitizeHtml';

// --- สร้าง Sub-Component สำหรับจัดการแกลเลอรีรูปภาพ ---
function ProductGallery({ images }: { images: { src: string; alt: string; id: number }[] }) {
  // ถ้าไม่มีรูปภาพเลย ให้แสดงเป็น placeholder
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg">
        No Image Available
      </div>
    );
  }

  // ใช้ useState เพื่อจัดการว่ารูปไหนกำลังถูกเลือกอยู่
  const [selectedImage, setSelectedImage] = useState(images[0]);

  // ใช้ useEffect เพื่อเปลี่ยนรูปหลักเมื่อ props เปลี่ยนไป (เผื่อข้อมูลโหลดช้า)
  useEffect(() => {
    setSelectedImage(images[0]);
  }, [images]);

  return (
    <div className="w-full">
      {/* ส่วนแสดงรูปภาพหลักขนาดใหญ่ */}
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-lg mb-4">
        <Image
          src={selectedImage.src}
          alt={selectedImage.alt || 'Selected product image'}
          width={800}
          height={800}
          className="w-full h-full object-cover overflow-hidden"
          priority // โหลดรูปนี้ก่อนเพื่อประสิทธิภาพ
        />
      </div>

      {/* ส่วนแสดงรูปภาพ Thumbnail ด้านล่าง (จะแสดงก็ต่อเมื่อมีรูปมากกว่า 1 รูป) */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {images.map((image) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${selectedImage.id === image.id ? 'border-purple-600 ring-2 ring-purple-300' : 'border-transparent'} hover:border-purple-400`}
            >
              <Image
                src={image.src}
                alt={image.alt || `Product thumbnail`}
                width={150}
                height={150}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


// --- ProductView Component หลัก ---
// รับผิดชอบการจัด Layout และแสดงข้อมูลทั้งหมด
export default function ProductView({ product }: { product: Product | null }) {
  // แสดงหน้า Loading หรือ Not Found ถ้ายังไม่มีข้อมูล
  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <p className="text-gray-500 mt-2">The product you are looking for does not exist or may have been removed.</p>
      </div>
    );
  }

  const videoGroup = product.acf?.product_videos;
  const videoIframes = videoGroup ?
    Object.values(videoGroup).filter((iframe): iframe is string => typeof iframe === 'string' && iframe.length > 0)
    : [];

  return (
    <div className="space-y-12 lg:space-y-16">
      {/* ส่วนบน: รูปภาพและข้อมูลเบื้องต้น */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">
        <ProductGallery images={product.images} />
        <div className="sticky top-28">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>

          {/* ใช้ price_html จาก WooCommerce เพื่อแสดงราคาที่จัดรูปแบบแล้ว (เช่น ราคาลด) */}
          <div
            className="text-3xl font-bold text-purple-700 mb-6"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.price_html || `฿${product.price}`) || 'Price not available.' }}
          />

          {/* ใช้ short_description สำหรับคำอธิบายย่อ */}
          <div
            className="prose mt-4 text-gray-700"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.short_description) || 'No description available.' }}
          />

          <div className="mt-8">
            <button className="w-full bg-gray-900 text-white font-bold py-4 px-6 rounded-lg hover:bg-gray-700 transition-colors text-lg">Get a Dealer</button>
          </div>
        </div>
      </div>

      {/* ส่วน Video (ถ้ามี) */}
      <ProductVideo iframeHtmls={videoIframes} />

      {/* ส่วนล่าง: รายละเอียดเพิ่มเติมทั้งหมด */}
      <div className="w-full">
        {/* ใช้ product.description สำหรับคำอธิบายแบบยาว */}
        {product.description && (
          <div className="py-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 uppercase">Product Description</h2>
            <div className="leading-loose prose max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) || 'No description available.' }} />
          </div>
        )}

        {/* แสดงผล Specifications จาก ACF */}
        {product.acf?.product_specifications && (
          <div className="item-start text-left py-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 uppercase">Specifications</h2>
            <div
              className="grid grid-cols-1 leading-loose prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.acf.product_specifications) || 'No specifications available.' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
