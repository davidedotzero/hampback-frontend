// src/app/blog/[slug]/page.tsx
// This dynamic page fetches and displays a single blog post by its slug.

import type { Metadata } from 'next';
import Image from 'next/image';
import { Post } from '@/types/post';
import { Calendar, User } from 'lucide-react';

/**
 * Fetches a single post by its slug from the WordPress REST API.
 */
async function getSinglePost(slug: string): Promise<Post | null> {
  try {
    const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
    const response = await fetch(`${wpApiBaseUrl}/wp/v2/posts?slug=${slug}&_embed`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;

    const postsData = await response.json();
    if (postsData.length === 0) return null;

    const post = postsData[0];
    return {
      id: post.id,
      slug: post.slug,
      date: post.date,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author_name: post._embedded?.author?.[0]?.name || 'Anonymous',
      featured_media_source_url: post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
    };
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return null;
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getSinglePost(params.slug);
  if (!post) return { title: 'Post Not Found' };
  
  const description = post.excerpt.rendered.replace(/<[^>]*>?/gm, '').trim();

  return {
    title: post.title.rendered,
    description: description,
    openGraph: {
      title: post.title.rendered,
      description: description,
      images: post.featured_media_source_url ? [post.featured_media_source_url] : [],
    },
  };
}

export default async function SinglePostPage({ params }: { params: { slug:string } }) {
  const post = await getSinglePost(params.slug);

  if (!post) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold">404 - Post Not Found</h1>
        <p className="mt-4 text-lg text-gray-600">Sorry, we couldn't find the post you were looking for.</p>
      </div>
    );
  }

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {post.title.rendered}
        </h1>
        <div className="mt-6 flex items-center text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <User size={16} />
            <span>{post.author_name}</span>
          </div>
          <span className="mx-2">·</span>
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <time dateTime={post.date}>{formattedDate}</time>
          </div>
        </div>
        {post.featured_media_source_url && (
          <div className="relative mt-8 h-80 w-full overflow-hidden rounded-xl">
            <Image
              src={post.featured_media_source_url}
              alt={post.title.rendered}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        <div
          className="prose prose-lg max-w-none mt-10"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
      </div>
    </div>
  );
}
