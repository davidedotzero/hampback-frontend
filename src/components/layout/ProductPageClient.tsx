// src/components/product/ProductPageClient.tsx
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import ProductCard from '@/components/product/ProductCard';
// import ProductFilter from './ProductFilter';

interface ProductPageClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductPageClient({ initialProducts, categories }: ProductPageClientProps) {
  // // --- ขั้นตอนสำหรับดีบัก ---
  // // Log นี้จะแสดงผลใน Console ของเบราว์เซอร์ (กด F12)
  // useEffect(() => {
  //   console.log("--- INITIAL DATA RECEIVED BY CLIENT ---");
  //   console.log("List of all Categories:", categories);
  //   if (initialProducts.length > 0) {
  //     console.log("Data of the first product:", initialProducts[0]);
  //     console.log("Categories array of the first product:", initialProducts[0].categories);
  //   }
  //   console.log("-------------------------------------");
  // }, [initialProducts, categories]);
  
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredAndSortedProducts = useMemo(() => {
    let products = [...initialProducts];

    if (searchTerm) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      products = products.filter(product => {
        const hasCategory = product.categories?.some(cat => cat.slug === selectedCategory);
        
        // // --- ส่วนดีบักเพิ่มเติม ---
        // // Log นี้จะทำงานทุกครั้งที่คุณเลือกฟิลเตอร์
        // if (hasCategory) {
        //   console.log(`✅ MATCH: Product "${product.name}" has category slug "${selectedCategory}".`);
        // }
        
        return hasCategory;
      });
    }
    
    if (sortBy === 'price-asc') {
      products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === 'price-desc') {
      products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    return products;
  }, [searchTerm, selectedCategory, sortBy, initialProducts]);

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-8">All Products</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* <aside className="lg:col-span-1">
          <ProductFilter
            categories={categories}
            selectedCategory={selectedCategory}
            sortBy={sortBy}
            onCategoryChange={setSelectedCategory}
            onSearchChange={setSearchTerm}
            onSortChange={setSortBy}
          />
        </aside> */}

        <main className="lg:col-span-3">
          {filteredAndSortedProducts.length > 0 ? (
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
