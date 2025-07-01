// src/types/about.ts
// Defines the data structures for the About Us page content.

import type { LucideProps } from 'lucide-react';

export interface AboutSection {
  icon: React.ElementType<LucideProps>;
  title: string;
  content: string;
}

export interface AboutPageData {
  heroImage: { 
    url: string; 
    alt: string;
  };
  heroTitle: string;
  heroSubtitle: string;
  sections: AboutSection[];
}
