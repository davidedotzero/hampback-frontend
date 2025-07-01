// src/app/about/page.tsx
// This version fixes the data parsing logic for the nested ACF Group field.

import type { Metadata } from 'next';
import Image from 'next/image';
import { Target, Globe, Cpu, Layers, type LucideProps } from 'lucide-react';
import { AboutPageData, AboutSection } from '@/types/about';
import { sanitizeHtml } from '@/lib/sanitizeHtml';

// --- Icon Mapping ---
const iconMap: { [key: string]: React.ElementType<LucideProps> } = {
    Target,
    Cpu,
    Globe,
    Layers,
};

// --- Data Fetching Function ---
async function getAboutPageData(): Promise<AboutPageData | null> {
    try {
        const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
        // !!! IMPORTANT: Change this to the ID of your actual "About Us" page in WordPress !!!
        const ABOUT_PAGE_ID = 157; // Using the ID from your log
        
        const response = await fetch(`${wpApiBaseUrl}/wp/v2/pages/${ABOUT_PAGE_ID}?_fields=acf`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch About Us page data (Status: ${response.status})`);
        }

        const pageData = await response.json();
        const acf = pageData.acf;

        if (!acf) {
            console.error("[ERROR] ACF object not found in response.");
            return null;
        }

        const sections: AboutSection[] = [];
        const acfSectionsGroup = acf.about_content_sections || {};

        // ** THE FIX: Correctly access the nested properties within the group **
        for (let i = 1; i <= 4; i++) {
            // First, get the nested object for the current section (e.g., acfSectionsGroup['section_1'])
            const sectionData = acfSectionsGroup[`section_${i}`];

            // Then, access the properties from within that nested object
            if (sectionData) {
                const title = sectionData[`section_${i}_title`];
                const content = sectionData[`section_${i}_content`];
                const iconKey = sectionData[`section_${i}_icon`];

                if (title && content) {
                    sections.push({
                        icon: iconMap[iconKey] || Target,
                        title: title,
                        content: content,
                    });
                }
            }
        }
        
        return {
            heroImage: {
                url: acf.hero_background_image?.url || 'https://quirky-pike.27-254-134-21.plesk.page/wp-content/uploads/2025/06/hampbackace1719-jazz-300x169.jpg', // Fallback image
                alt: acf.hero_background_image?.alt || "A musician playing drums in a studio",
            },
            heroTitle: acf.about_hero_title || 'Our Story',
            heroSubtitle: acf.about_hero_subtitle || 'Forged from a passion for music.',
            sections: sections,
        };

    } catch (error) {
        console.error("Error fetching About Us page data:", error);
        return null;
    }
}

// --- Metadata ---
export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about the story, vision, and technology behind HAMPBACK, a leading electronic drum manufacturer.',
};


// --- The Page Component ---
export default async function AboutPage() {
  const data = await getAboutPageData();

  if (!data || data.sections.length === 0) {
    return (
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold">Content Not Available</h1>
          <p className="mt-4 text-lg text-gray-600">The content for the About Us page is currently being updated. Please check back later.</p>
        </div>
      );
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-800 isolate">
        <Image
          src={data.heroImage.url}
          alt={data.heroImage.alt}
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20"
          width={1920}
          height={1080}
          priority
        />
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              {data.heroTitle}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              {data.heroSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 lg:px-8">
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {data.sections.map((section) => (
            <div key={section.title} className="flex gap-x-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-600">
                <section.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-xl font-semibold leading-7 text-gray-900">{section.title}</h3>
                <div 
                    className="mt-4 p-6 text-base leading-7 text-gray-600 prose"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(section.content) }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
