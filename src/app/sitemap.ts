// src/app/sitemap.ts
// This file generates the sitemap.xml dynamically based on your site's pages.

//  สิ่งสำคัญที่สุดที่คุณต้องทำคือ แก้ไข baseUrl ในไฟล์ sitemap.ts และ product/[slug]/page.tsx ให้เป็นโดเมนจริงของคุณเมื่อนำขึ้น Production ครับ

import { MetadataRoute } from 'next';
import { Product } from '@/types/product'; // Ensure the path to your type is correct

// !!! IMPORTANT: Replace this with your actual production domain !!!
const baseUrl = 'https://hampback.vercel.app'; // <--- แก้ไขเป็นโดเมนจริงของคุณ

/**
 * Fetches all products from the WooCommerce API to generate dynamic sitemap entries.
 * Note: If you have more than 100 products, you'll need to handle pagination.
 * @returns {Promise<Product[]>} A promise that resolves to an array of products.
 */
async function getAllProducts(): Promise<Product[]> {
  try {
    const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || '';
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || '';
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    
    // Fetch up to 100 products. Adjust `per_page` if needed.
    const response = await fetch(`${wpApiBaseUrl}/wc/v3/products?per_page=100`, {
      headers: { 'Authorization': `Basic ${auth}` },
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      console.error(`Sitemap: Failed to fetch products, status: ${response.status}`);
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error("Sitemap: Error fetching products:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static page routes
  const staticRoutes = [
    '/',
    '/products',
    '/about',
    '/blogs',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '/' ? 1 : 0.8,
  }));

  // 2. Dynamic product page routes
  const products = await getAllProducts();
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: product.date_modified || new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Combine all routes
  return [...staticRoutes, ...productRoutes];
}
