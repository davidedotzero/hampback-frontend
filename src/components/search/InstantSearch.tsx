// src/components/search/InstantSearch.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { Product } from '@/types/product';
import { sanitizeHtml } from '@/lib/sanitizeHtml';

// ฟังก์ชัน Debounce เพื่อหน่วงการส่ง request
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}


export default function InstantSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // ใช้ Debounce กับ searchTerm เพื่อไม่ให้ยิง API ทุกครั้งที่พิมพ์
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // ฟังก์ชันสำหรับดึงข้อมูลผลการค้นหา
  const fetchResults = useCallback(async () => {
    if (debouncedSearchTerm.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedSearchTerm)}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error(error);
      setResults([]); // Clear results on error
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // จัดการการคลิกนอกพื้นที่ Search box เพื่อปิด Dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);
  
  // ฟังก์ชันสำหรับ submit (กด Enter)
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`); // ยังคงฟังก์ชันนี้ไว้เผื่ออยากไปหน้า search เต็มๆ
    setIsFocused(false);
  };


  return (
    <div className="relative w-full max-w-lg" ref={searchContainerRef}>
      <form onSubmit={handleSearchSubmit}>
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-gray-400" />
        </span>
        <input 
          type="text" 
          placeholder="SEARCH..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
      </form>

      {/* Dropdown แสดงผลการค้นหา */}
      {isFocused && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-2xl max-h-[60vh] overflow-y-auto z-50">
          {isLoading && (
            <div className="p-4 flex justify-center items-center">
              <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
            </div>
          )}

          {!isLoading && debouncedSearchTerm.length > 1 && results.length === 0 && (
            <p className="p-4 text-center text-gray-500">No products found for "{debouncedSearchTerm}".</p>
          )}

          {!isLoading && results.length > 0 && (
            <ul>
              {results.map(product => (
                <li key={product.id}>
                  <Link 
                    href={`/product/${product.slug}`}
                    className="flex items-center p-3 hover:bg-gray-100"
                    onClick={() => setIsFocused(false)} // ปิด dropdown เมื่อคลิก
                  >
                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-200 mr-4">
                      {product.images?.[0]?.src && (
                        <Image src={product.images[0].src} alt={product.name} fill style={{objectFit: 'cover'}}/>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.price_html || `฿${product.price}`) }} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
