// src/components/product/ProductView.tsx
"use client"; // ระบุว่าเป็น Client Component เพราะต้องมีการโต้ตอบ (คลิกเปลี่ยนรูป)

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/types/product';
import ProductVideo from './video/ProductVideo';
import { sanitizeHtml } from '@/lib/sanitizeHtml';

// --- สร้าง Sub-Component สำหรับจัดการแกลเลอรีรูปภาพ ---
function ProductGallery({ images }: { images: { id?: number; src: string; alt: string }[] }) {
  // ถ้าไม่มีรูปภาพ ให้แสดงผลเป็น placeholder
  if (!images || images.length === 0) {
    return <div className="aspect-square w-full flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg">No Image Available</div>;
  }
  
  // ตั้งค่า State เริ่มต้นจาก props โดยตรงเพื่อป้องกัน Hydration Mismatch
  const [selectedImageUrl, setSelectedImageUrl] = useState(images[0].src);

  return (
    <div className="w-full">
      {/* ส่วนแสดงรูปภาพหลักขนาดใหญ่ */}
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-lg mb-3">
        {selectedImageUrl && (
          <Image 
            src={selectedImageUrl} 
            alt="Selected product image" 
            width={800} 
            height={800} 
            className="w-full h-full object-cover transition-opacity duration-300" 
            priority 
          />
        )}
      </div>
      
      {/* --- การแก้ไข: ส่วนแสดงรูปภาพเล็กๆ (Thumbnail) ที่สามารถเลื่อนได้ --- */}
      {images.length > 1 && (
        // ใช้ flex และ overflow-x-auto เพื่อสร้างแถวที่เลื่อนได้ในแนวนอน
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={`${image.id}-${index}`}
              onClick={() => setSelectedImageUrl(image.src)}
              // กำหนดขนาดของ Thumbnail ให้คงที่และไม่หด
              className={`relative w-40 h-40 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200 ${selectedImageUrl === image.src ? 'border-purple-600 ring-2 ring-purple-300' : 'border-gray-200 hover:border-purple-400'}`}
            >
              <Image 
                src={image.src} 
                alt={image.alt || `Product thumbnail ${index + 1}`} 
                fill // ใช้ fill เพื่อให้รูปภาพเต็มพื้นที่ของปุ่ม
                style={{objectFit: 'cover'}}
                sizes="(max-width: 768px) 20vw, 10vw" // ช่วย Next.js โหลดรูปขนาดที่เหมาะสม
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
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.short_description)}}
          />

          <div className="mt-8">
            <button className="w-full bg-gray-900 text-white font-bold py-4 px-6 rounded-lg hover:bg-gray-700 transition-colors text-lg">Get a Dealer</button>
          </div>

          {/* แสดงผล Specifications จาก ACF */}
          {product.acf?.product_specifications && (
          <div className="mt-10 border-t pt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Specifications</h2>
            {/* การแก้ไข:
              - ใช้ arbitrary variants `[&_...]` เพื่อควบคุมสไตล์ของ HTML ที่มาจาก WordPress ได้อย่างละเอียด
            */}
            <div 
              className="prose prose-sm max-w-none
                         [&_table]:w-full [&_table]:table-fixed
                         [&_tr]:border-b [&_tr]:border-gray-200
                         [&_th]:w-[30%] [&_th]:pr-4 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-gray-700 [&_th]:align-top
                         [&_td]:w-[70%] [&_td]:py-2 [&_td]:pl-4 [&_td]:align-top
                         [&_h2]:m-0 [&_h2]:text-xl"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.acf.product_specifications) }} 
            />
          </div>
        )}
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
      </div>
    </div>
  );
}
