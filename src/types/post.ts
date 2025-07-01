// src/types/post.ts
// Defines the data structure for a single blog post from the WordPress REST API.

export interface Post {
  id: number;
  slug: string;
  date: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  // These fields come from the _embedded object when using `?_embed`
  author_name: string;
  featured_media_source_url?: string; // The URL for the featured image
}
