// src/components/ui/Breadcrumb.tsx
// A reusable component for displaying breadcrumb navigation.

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

// Define the type for each breadcrumb item
interface BreadcrumbItem {
  label: string;
  href?: string;
}

// Define the props for the Breadcrumb component
interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm text-gray-500 flex-wrap">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {/* If it's not the first item, add a separator */}
            {index > 0 && (
              <ChevronRight className="w-4 h-4 mx-2 text-gray-400 flex-shrink-0" />
            )}
            
            {/* If the item has a link (is not the last item) */}
            {item.href ? (
              <Link href={item.href} className="hover:text-purple-600 hover:underline">
                {item.label}
              </Link>
            ) : (
              // The last item is the current page, so it's not a link
              <span className="font-semibold text-gray-700">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
