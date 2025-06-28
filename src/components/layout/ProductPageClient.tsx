// src/components/product/ProductPageClient.tsx
"use client";

import { useState, useMemo, useEffect } from 'react'; // เพิ่ม useEffect
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import ProductCard from '@/components/product/ProductCard';
import ProductFilter from '@/components/layout/ProductFilter';

interface ProductPageClientProps {
  initialProducts: Product[];
  categories: Category[];
}

// --- สร้าง Skeleton Component สำหรับสถานะ Loading ---
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square w-full bg-gray-200 rounded-lg"></div>
          <div className="mt-4 h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="mt-2 h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}


export default function ProductPageClient({ initialProducts, categories }: ProductPageClientProps) {
  // State สำหรับเก็บค่าจาก Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // --- การแก้ไข: เพิ่ม State เพื่อตรวจสอบว่า Component ถูก Mount แล้ว ---
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let products = [...initialProducts];

    if (searchTerm) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      const selectedCategoryId = categories.find(cat => cat.slug === selectedCategory)?.id;
      if (selectedCategoryId) {
        products = products.filter(product =>
          product.categories?.some(cat => cat.id === selectedCategoryId)
        );
      }
    }
    
    if (sortBy === 'price-asc') {
      products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === 'price-desc') {
      products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    return products;
  }, [searchTerm, selectedCategory, sortBy, initialProducts, categories]);


  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-8">All Products</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <ProductFilter
            categories={categories}
            selectedCategory={selectedCategory}
            sortBy={sortBy}
            onCategoryChange={setSelectedCategory}
            onSearchChange={setSearchTerm}
            onSortChange={setSortBy}
          />
        </aside>

        <main className="lg:col-span-3">
          {/* --- การแก้ไข: แสดง Skeleton ขณะที่ยังไม่ Mount --- */}
          {!isMounted ? (
            <ProductGridSkeleton />
          ) : filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-16">No products found matching your criteria.</p>
          )}
        </main>
      </div>
    </div>
  );
}
