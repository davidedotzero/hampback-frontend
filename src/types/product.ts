// src/types/product.ts
export interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  price_html?: string;
  short_description: string;
  description: string;
  images: { id: number; src: string; alt: string; }[];
  categories: { id: number; name: string; slug: string; }[];
  acf?: {
    product_specifications?: string;
    product_videos?: {
      product_video_1?: string; 
      product_video_2?: string;
      product_video_3?: string;
    }
  };
}