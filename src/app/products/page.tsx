// src/app/products/page.tsx

import ProductPageClient from '@/components/layout/ProductPageClient';
import { Product } from '@/types/product'; 
import { Category } from '@/types/category';
import type { Metadata } from 'next';

// --- Page Specific Metadata ---
export const metadata: Metadata = {
  title: 'All Products',
  description: 'Browse our complete collection of high-quality music gear, instruments, and accessories. Find everything you need from Hampback.',
};

const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

// --- API endpoint ของ WooCommerce ---
const productsApiUrl = `${wpApiBaseUrl}/wc/v3/products?per_page=100`;
const categoriesApiUrl = `${wpApiBaseUrl}/wc/v3/products/categories?_fields=id,name,slug`;
// --- Authentication Header (สำคัญมาก) ---
const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || '';
const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || '';
const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
const headers = { 'Authorization': `Basic ${auth}` };

async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await fetch(productsApiUrl, { headers, next: { revalidate: 60 } });
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
}

async function getAllCategories(): Promise<Category[]> {
  try {
    const response = await fetch(categoriesApiUrl, { headers, next: { revalidate: 3600 } });
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const [initialProducts, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories()
  ]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <ProductPageClient 
        initialProducts={initialProducts} 
        categories={categories}
      />
    </div>
  );
}
