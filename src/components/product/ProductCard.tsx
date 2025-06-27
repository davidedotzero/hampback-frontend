// src/components/product/ProductCard.tsx
"use client"; // <--- เพิ่มบรรทัดนี้เพื่อแก้ปัญหา Hydration Error

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Product } from '@/types/product';

export default function ProductCard({ product }: { product: Product }) {
  // ดึงข้อมูลจากโครงสร้างใหม่ของ WooCommerce
  const imageUrl = product.images?.[0]?.src;
  const price = product.price;
  const name = product.name;

  return (
    <div className="group">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="w-full bg-gray-100 rounded-lg overflow-hidden aspect-square">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name || 'Product image'}
              width={500}
              height={500}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">No Image</div>
          )}
        </div>
        
        <div className="mt-4">
          <h3 className="text-lg md:text-xl font-bold text-gray-900">{name}</h3>
          <div className="mt-2 flex justify-between items-center">
            <p className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter">
              {price ? `฿${price}.-` : ''}
            </p>
            <button 
              className="text-gray-400 hover:text-red-500 transition-colors focus:outline-none"
              aria-label="Add to wishlist"
              onClick={(e) => { e.preventDefault(); console.log('Wishlist clicked!'); }}
            >
              <Heart size={28} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
