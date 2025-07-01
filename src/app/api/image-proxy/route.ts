// src/app/api/image-proxy/route.ts
// This API route acts as a proxy to bypass CORS issues for loading images.

import { NextRequest, NextResponse } from 'next/server';

// Get the allowed WordPress domain from environment variables for security
const ALLOWED_DOMAIN = process.env.NEXT_PUBLIC_WORDPRESS_API_URL
  ? new URL(process.env.NEXT_PUBLIC_WORDPRESS_API_URL).hostname
  : '';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return new NextResponse('Image URL is required', { status: 400 });
    }

    const externalUrl = new URL(imageUrl);

    // Security check: Only allow proxying from your own WordPress domain
    if (ALLOWED_DOMAIN && externalUrl.hostname !== ALLOWED_DOMAIN) {
      return new NextResponse('Proxying from this domain is not allowed', { status: 403 });
    }

    // Fetch the image from the external URL
    const imageResponse = await fetch(externalUrl.href);

    if (!imageResponse.ok) {
      return new NextResponse('Failed to fetch the image', { status: imageResponse.status });
    }

    // Get the image data as a blob
    const imageBlob = await imageResponse.blob();
    
    // Create a new response, streaming the image data back to the client
    return new NextResponse(imageBlob, {
      status: 200,
      headers: {
        'Content-Type': imageResponse.headers.get('Content-Type') || 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
      },
    });

  } catch (error) {
    console.error('Image Proxy Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
