// src/app/page.tsx
// FINAL ROBUST METHOD: This version fetches full image details using the IDs from the ACF Group.
// This method is not dependent on the ACF "Return Format" setting.

import InteractiveHero from '@/components/home/InteractiveHero';
import { HeroImage } from '@/types/data';

async function getHeroImages(): Promise<HeroImage[]> {
    console.log("--- [DEBUG] Starting getHeroImages (Robust Fetch Method) ---");
    try {
        const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
        // !!! IMPORTANT: Make sure this ID is correct for your homepage !!!
        const HOMEPAGE_ID = 2; 

        // Step 1: Fetch the page to get the ACF group containing image IDs
        const pageResponse = await fetch(`${wpApiBaseUrl}/wp/v2/pages/${HOMEPAGE_ID}?_fields=acf`, {
            next: { revalidate: 3600 }
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
        console.log("[DEBUG] Received ACF Group with Image IDs:", acfGroup);

        // Step 2: Extract all valid image IDs from the group
        const imageIds = Object.values(acfGroup).filter((id): id is number => typeof id === 'number' && id > 0);

        if (imageIds.length === 0) {
            console.warn("No valid image IDs found in the ACF group.");
            return [];
        }
        console.log(`[DEBUG] Found ${imageIds.length} image IDs to fetch:`, imageIds);
        
        // Step 3: Fetch full details for each image ID concurrently
        const imagePromises = imageIds.map(id => 
            fetch(`${wpApiBaseUrl}/wp/v2/media/${id}`)
                .then(res => {
                    if (!res.ok) throw new Error(`Failed to fetch media ID ${id}`);
                    return res.json();
                })
        );

        const mediaItems = await Promise.all(imagePromises);
        console.log("[DEBUG] Successfully fetched full data for all media items.");

        // Step 4: Map the full media data to our required HeroImage type
        return mediaItems.map((item: any) => ({
            id: item.id,
            url: item.source_url,
            alt: item.alt_text || 'Hampback Hero Image',
            // Use data from the media library fields
            product_slug: item.description?.rendered.replace(/<p>|<\/p>/g, '').trim() || '/',
            product_name: item.title?.rendered || 'Featured Product',
            category_name: item.caption?.rendered.replace(/<p>|<\/p>/g, '').trim() || 'Hampback Gear',
        }));

    } catch (error) {
        console.error("--- [ERROR] An error occurred in getHeroImages ---", error);
        return [];
    }
}


export default async function HomePage() {
  const heroImages = await getHeroImages();

  return (
    <>
      <InteractiveHero heroImages={heroImages} />
      
      <main>
        {/* Other sections */}
      </main>
    </>
  );
}
