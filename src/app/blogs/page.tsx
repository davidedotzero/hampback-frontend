// src/app/blogs/page.tsx
// This page fetches and displays a list of all blog posts.

import type { Metadata } from 'next';
import { Post } from '@/types/post';
import PostCard from '@/components/blog/PostCard';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read the latest news, articles, and insights from Hampback.',
};

/**
 * Fetches all posts from the WordPress REST API.
 * The `_embed` parameter is used to include related data like author name and featured image URL.
 */
async function getPosts(): Promise<Post[]> {
  try {
    const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
    const response = await fetch(`${wpApiBaseUrl}/wp/v2/posts?_embed&per_page=100`, {
      next: { revalidate: 3600 }, // Cache posts for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts. Status: ${response.status}`);
    }

    const postsData = await response.json();

    // Map the raw data to our clean 'Post' type
    return postsData.map((post: any) => ({
      id: post.id,
      slug: post.slug,
      date: post.date,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author_name: post._embedded?.author?.[0]?.name || 'Anonymous',
      featured_media_source_url: post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
    }));
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export default async function BlogsPage() {
  const posts = await getPosts();

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">From the Blog</h1>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Latest news, tips, and stories from the Hampback team.
          </p>
        </div>
        {posts.length > 0 ? (
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-gray-500">No blog posts found.</p>
        )}
      </div>
    </div>
  );
}
