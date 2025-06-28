// src/components/product/ProductVideoGrid.tsx
"use client";

interface ProductVideoGridProps {
  // รับ array ของโค้d iframe ที่เป็น HTML string เข้ามา
  iframeHtmls: string[];
}

export default function ProductVideoGrid({ iframeHtmls }: ProductVideoGridProps) {
  if (!iframeHtmls || iframeHtmls.length === 0) {
    return null;
  }

  return (
    <div className="mt-10 border-t pt-6 border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Product Videos</h2>
      {/* สร้างกริดที่ responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {iframeHtmls.map((iframeHtml, index) => (
          <div 
            key={index}
            // ใช้ aspect-ratio 16:9 สำหรับวิดีโอแนวนอน
            className="aspect-video w-full overflow-hidden rounded-xl shadow-lg
                       [&_iframe]:w-full [&_iframe]:h-full"
            dangerouslySetInnerHTML={{ __html: iframeHtml }}
          />
        ))}
      </div>
    </div>
  );
}
