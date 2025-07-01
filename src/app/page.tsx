// src/app/page.tsx
// This is the main server component for the homepage.
// Its primary role is to fetch data and pass it to client components for rendering.

import InteractiveHero from '@/components/home/InteractiveHero';
import { HeroImage } from '@/types/data';

/**
 * Represents the structure of a media item from the WordPress REST API.
 */
interface WPMediaItem {
  id: number;
  source_url: string;
  alt_text: string;
  description: {
    rendered: string;
  };
  title: {
    rendered: string;
  };
  caption: {
    rendered: string;
  };
}


/**
 * Fetches and processes image data for the Hero Carousel from WordPress.
 * This robust method uses a multi-step process:
 * 1. Fetches the homepage to get an ACF Group field containing image IDs.
 * 2. Extracts the valid image IDs from the group.
 * 3. Fetches the full details for each image ID from the WordPress Media API.
 * 4. Maps the full media data into a clean `HeroImage[]` array.
 * This approach is reliable and not dependent on the ACF "Return Format" setting.
 * * @returns {Promise<HeroImage[]>} A promise that resolves to an array of hero images.
 */
async function getHeroImages(): Promise<HeroImage[]> {
    try {
        const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
        // !!! IMPORTANT: Make sure this ID is correct for your homepage in WordPress !!!
        const HOMEPAGE_ID = 2; 

        // Step 1: Fetch the page to get the ACF group containing image IDs
        const pageResponse = await fetch(`${wpApiBaseUrl}/wp/v2/pages/${HOMEPAGE_ID}?_fields=acf`, {
            next: { revalidate: 3600 } // Cache data for 1 hour
        });

        if (!pageResponse.ok) {
            throw new Error(`Failed to fetch homepage data (Status: ${pageResponse.status})`);
        }

        const pageData = await pageResponse.json();
        const acfGroup = pageData.acf?.hero_carousel_images;

        if (!acfGroup || typeof acfGroup !== 'object') {
            console.warn("ACF Group 'hero_carousel_images' not found or is not an object.");
            return [];
        }

        // Step 2: Extract all valid image IDs from the group
        const imageIds = Object.values(acfGroup).filter((id): id is number => typeof id === 'number' && id > 0);

        if (imageIds.length === 0) {
            console.warn("No valid image IDs found in the ACF group.");
            return [];
        }
        
        // Step 3: Fetch full details for each image ID concurrently using Promise.all
        const imagePromises = imageIds.map(id => 
            fetch(`${wpApiBaseUrl}/wp/v2/media/${id}`)
                .then(res => {
                    if (!res.ok) throw new Error(`Failed to fetch media ID ${id}`);
                    return res.json();
                })
        );

        const mediaItems = await Promise.all(imagePromises);

        // Step 4: Map the full media data to our required HeroImage type, cleaning up HTML tags
        return mediaItems.map((item: WPMediaItem) => ({
            id: item.id,
            url: item.source_url,
            alt: item.alt_text || 'Hampback Hero Image',
            product_slug: item.description?.rendered.replace(/<[^>]*>?/gm, '').trim() || '/',
            product_name: item.title?.rendered.replace(/<[^>]*>?/gm, '').trim() || 'Featured Product',
            category_name: item.caption?.rendered.replace(/<[^>]*>?/gm, '').trim() || 'Hampback Gear',
        }));

    } catch (error) {
        console.error("Error in getHeroImages:", error);
        return []; // Return an empty array to prevent the page from crashing
    }
}


export default async function HomePage() {
  const heroImages = await getHeroImages();

  return (
    <>
      <InteractiveHero heroImages={heroImages} />
      
      <main>
        {/* Other homepage sections can be added here */}
      </main>
    </>
  );
}
