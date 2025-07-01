// src/app/dealers/page.tsx
// This is the main server component for the dealer locator page.

import type { Metadata } from 'next';
import DealerLocatorClient from '@/components/dealers/DealerLocatorClient';
import { Dealer } from '@/types/dealer';

export const metadata: Metadata = {
  title: 'Find a Dealer',
  description: 'Locate authorized Hampback dealers and retailers near you.',
};

/**
 * Fetches dealer data from the WordPress REST API.
 * NOTE: This assumes you have a Custom Post Type 'dealer' in WordPress
 * with Advanced Custom Fields (ACF) for address, phone, latitude, and longitude.
 */
async function getDealers(): Promise<Dealer[]> {
   try {
    const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
    
    // The endpoint for our "dealer" Custom Post Type.
    // We add `?_fields=id,title,acf` to only get the data we need.
    const dealersApiUrl = `${wpApiBaseUrl}/wp/v2/dealer?_fields=id,title,acf&per_page=100`;

    const response = await fetch(dealersApiUrl, {
        next: { revalidate: 60 }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch dealers. Status: ${response.status}`);
    }

    const dealersData = await response.json();

    // Map the raw data from WordPress to our clean 'Dealer' type.
    return dealersData.map((dealerPost: any) => {
        // Access the custom fields through the 'acf' object.
        const acf = dealerPost.acf;
        return {
            id: dealerPost.id,
            name: dealerPost.title.rendered,
            address: acf.address || 'No address provided',
            phone: acf.phone || undefined,
            website: acf.website || undefined,
            coordinates: {
                // Convert the text coordinates from ACF to numbers.
                lat: parseFloat(acf.latitude) || 0,
                lng: parseFloat(acf.longitude) || 0,
            },
        };
    });

  } catch (error) {
    console.error("Error fetching dealers:", error);
    return []; // Return an empty array on error to prevent the page from crashing.
  }
}

export default async function DealersPage() {
  const dealers = await getDealers();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Find a Hampback Dealer</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Find authorized dealers and retailers near you to experience our products firsthand.
          </p>
        </div>
        
        {/* The client component handles all interactivity */}
        <DealerLocatorClient dealers={dealers} />
      </div>
    </div>
  );
}
