interface AcfImage {
  ID: number;
  id: number;
  title: string;
  url: string;
  alt: string;
}

export interface Page {
  acf:{hero?: AcfImage;};
}

export interface AboutPageData {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: {
      source_url: string;
    }[];
  };
}

export interface HeroImage {
  id: number;
  url: string;
  alt: string;
  // Optional: link to a product if you want a specific image to be clickable
  // You can add this as a custom field to the image attachment in WordPress
  product_slug?: string;
  product_name?: string; // Add a field for the product name
  category_name?: string; // Add a field for the category name
}