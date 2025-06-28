// src/app/api/search/route.ts
import { NextResponse } from 'next/server';
import { Product } from '@/types/product';

// ฟังก์ชันนี้จะทำงานที่ Server เท่านั้น ทำให้ API Keys ของเราปลอดภัย
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ message: 'Search query is required' }, { status: 400 });
  }

  const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
  // --- การแก้ไข: เปลี่ยนไปใช้ WooCommerce products endpoint ---
  const productsApiUrl = `${wpApiBaseUrl}/wc/v3/products?search=${query}`;
  
  // --- การแก้ไข: เพิ่มการยืนยันตัวตน (Authentication) ---
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || '';
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || '';
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  
  try {
    const response = await fetch(productsApiUrl, {
      headers: { 
        'Authorization': `Basic ${auth}` 
      },
      next: { revalidate: 60 } // Cache ผลการค้นหาไว้ 60 วินาที
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("WooCommerce API Error:", errorData);
      return NextResponse.json({ message: 'Failed to fetch from WooCommerce API' }, { status: response.status });
    }

    const products: Product[] = await response.json();
    return NextResponse.json(products);

  } catch (error) {
    console.error("Internal Server Error in search API:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
