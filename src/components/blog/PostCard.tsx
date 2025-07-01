// src/components/blog/PostCard.tsx
// A reusable card component to display a summary of a blog post.

import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types/post';
import { Calendar, User } from 'lucide-react';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  // Format the date for better readability
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-lg">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative h-56 w-full bg-gray-100">
          {post.featured_media_source_url ? (
            <Image
              src={post.featured_media_source_url}
              alt={post.title.rendered}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
              No Image
            </div>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col justify-between bg-white p-6">
        <div>
          <Link href={`/blog/${post.slug}`} className="block">
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-600">
              {post.title.rendered}
            </h3>
            <div
              className="mt-3 text-gray-600 line-clamp-3"
              dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
            />
          </Link>
        </div>
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
      </div>
    </article>
  );
}
