// src/components/product/ProductFilter.tsx
"use client";

import { Category } from '@/types/category';
import { Search } from 'lucide-react';

interface ProductFilterProps {
  categories: Category[];
  selectedCategory: string;
  sortBy: string;
  onCategoryChange: (slug: string) => void;
  onSearchChange: (term: string) => void;
  onSortChange: (sortValue: string) => void;
}

export default function ProductFilter({ 
  categories, 
  selectedCategory, 
  sortBy,
  onCategoryChange, 
  onSearchChange,
  onSortChange
}: ProductFilterProps) {
  return (
    <div className="w-full space-y-8">
      {/* Search Input */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Search</h3>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search size={20} />
          </span>
          <input 
            type="text"
            placeholder="Search products..."
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
      </div>

      {/* Sort By Dropdown */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Sort by</h3>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full border border-gray-300 rounded-md py-2 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
      
      {/* Category List */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Categories</h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => onCategoryChange('all')}
              className={`w-full text-left p-2 rounded-md transition-colors ${selectedCategory === 'all' ? 'bg-purple-600 text-white font-bold' : 'hover:bg-gray-100'}`}
            >
              All Categories
            </button>
          </li>
          {categories.map(category => (
            <li key={category.id}>
              <button
                onClick={() => onCategoryChange(category.slug)}
                className={`w-full text-left p-2 rounded-md transition-colors ${selectedCategory === category.slug ? 'bg-purple-600 text-white font-bold' : 'hover:bg-gray-100'}`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
