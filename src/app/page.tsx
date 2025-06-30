// src/app/page.tsx
// DEBUGGING VERSION: This version adds console logs to diagnose why images are not appearing.

import InteractiveHero from '@/components/home/InteractiveHero';
import { HeroImage } from '@/types/data';

/**
 * Fetches image data from an ACF Group field on the WordPress homepage.
 * The Group field contains multiple individual Image sub-fields.
 * @returns {Promise<HeroImage[]>} A list of images for the hero carousel.
 */
async function getHeroImages(): Promise<HeroImage[]> {
    console.log("--- [DEBUG] Starting getHeroImages function ---");
    try {
        const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
        // !!! IMPORTANT: Change this to the ID of your actual homepage in WordPress !!!
        const HOMEPAGE_ID = 2; 
        console.log(`[DEBUG] Fetching data for Homepage ID: ${HOMEPAGE_ID}`);

        const response = await fetch(`${wpApiBaseUrl}/wp/v2/pages/${HOMEPAGE_ID}?_fields=acf`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        console.log(`[DEBUG] API Response Status: ${response.status}`);
        if (!response.ok) {
            console.error(`[ERROR] Failed to fetch homepage data. Status: ${response.status}`);
            throw new Error('Failed to fetch homepage data.');
        }

        const pageData = await response.json();
        // Log the entire raw response to see what we're getting from WordPress
        console.log("[DEBUG] Raw pageData from API:", JSON.stringify(pageData, null, 2));
        
        // Access the Group field by its name: 'hero_carousel_images'
        const acfGroup = pageData.acf?.hero_carousel_images;

        if (!acfGroup) {
            console.warn("[WARN] ACF Group 'hero_carousel_images' not found in the API response.");
            return [];
        }

        console.log("[DEBUG] Found acfGroup:", acfGroup);

        const images: HeroImage[] = [];

        // Manually check each sub-field inside the group and push it to the array
        Object.keys(acfGroup).forEach(key => {
            const img = acfGroup[key];
            console.log(`[DEBUG] Processing key "${key}":`, img);
            // Check if the field is a valid image object before adding
            if (img && typeof img === 'object' && img.id) {
                const imageData = {
                    id: img.id,
                    url: img.url,
                    alt: img.alt || 'Hampback Hero Image',
                    product_slug: img.product_slug || '/', // You can add custom fields to image attachments
                    product_name: img.title || 'Featured Product',
                    category_name: img.caption || 'Hampback Gear',
                };
                images.push(imageData);
                console.log(`[SUCCESS] Pushed image to array:`, imageData);
            } else {
                console.warn(`[WARN] Key "${key}" did not contain a valid image object or was false. Skipping.`);
            }
        });
        
        console.log(`--- [DEBUG] Finished getHeroImages. Found ${images.length} images. ---`);
        return images;

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
        {/* Your other homepage sections can go here */}
      </main>
    </>
  );
}
