// src/app/products/[slug]/page.tsx

// เราจะยังคงแยก Client Component ออกมาเพื่อโครงสร้างที่ดี
import ProductView from '@/components/product/ProductView';
import { Product } from '@/types/product';
import type { Metadata } from 'next';

const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
// !!! IMPORTANT: Replace this with your actual production domain !!!
const baseUrl = 'https://hampback.vercel.app'; // <--- แก้ไขเป็นโดเมนจริงของคุณ

// --- ฟังก์ชันสำหรับดึงข้อมูลสินค้า (จากคู่มือ) ---
async function getSingleProductBySlug(slug: string): Promise<Product | null> {
  const productsApiUrl = `${wpApiBaseUrl}/wc/v3/products`;
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || '';
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || '';
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  
  try {
    const response = await fetch(`${productsApiUrl}?slug=${slug}`, {
      headers: { 'Authorization': `Basic ${auth}` },
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      return null;
    }
    
    const products = await response.json();
    return products[0] || null;
  } catch (error) {
    console.error(`Error fetching product with slug: ${slug}`, error);
    return null;
  }
}

// --- ฟังก์ชัน generateMetadata (ดึงข้อมูลจาก WooCommerce) ---
// export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
//   const product = await getSingleProductBySlug(params.slug);

//   if (!product) {
//     return {
//       title: 'Product Not Found',
//     };
//   }

//   const description = product.short_description.replace(/<[^>]+>/g, '');

//   return {
//     title: product.name,
//     description: description,
//   };
// }

// --- Dynamic Metadata Generation (SEO Optimized) ---
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getSingleProductBySlug(params.slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  // Sanitize description for meta tags
  const description = product.short_description.replace(/<[^>]+>/g, '').trim();
  const mainImage = product.images?.[0]?.src;

  return {
    title: product.name,
    description: description,
    keywords: [product.name, 'Hampback', ...product.categories.map(c => c.name)],
    openGraph: {
      title: `${product.name} | Hampback`,
      description: description,
      url: `${baseUrl}/product/${product.slug}`,
      siteName: 'Hampback Music Gear',
      images: mainImage ? [
        {
          url: mainImage,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ] : [],
      locale: 'en_US', // Or 'th_TH'
      type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: `${product.name} | Hampback`,
        description: description,
        images: mainImage ? [mainImage] : [],
    },
  };
}

// --- Page Component (Server Component หลัก) ---
export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getSingleProductBySlug(params.slug);

  // --- การแก้ไข: เพิ่ม Guard Clause เข้ามา ---
  // ตรวจสอบว่า `product` มีค่าหรือไม่ ก่อนที่จะส่งไปให้ Client Component
  if (!product) {
    // ถ้าไม่พบสินค้า ให้แสดงหน้าที่บอกว่าหาไม่เจอ
    return (
      <div className="container mx-auto text-center py-20">
        <h1 className="text-4xl font-bold">404 - Product Not Found</h1>
        <p className="mt-4 text-lg text-gray-600">Sorry, we couldn&apos;t find the product you were looking for.</p>
      </div>
    );
  }

  // ถ้าพบสินค้า ก็ส่งไปแสดงผลตามปกติ
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <ProductView product={product} />
    </div>
  );
}
