// src/app/api/newsletter/route.ts (FINAL VERSION)
// This code will work correctly after disabling antispam features in the WordPress plugin.

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
    }

    const formData = new URLSearchParams();
    formData.append('ne', email); // 'ne' is the default email field for the plugin
    formData.append('nr', 'widget'); // Identifies the source as a widget

    // Get the base URL of your WordPress site
    const wpBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/wp-json', '');

    if (!wpBaseUrl) {
      console.error('FATAL: NEXT_PUBLIC_WORDPRESS_API_URL is not configured correctly in .env.local');
      throw new Error('Server configuration error.');
    }

    // The submission URL for "The Newsletter Plugin"
    const submissionUrl = `${wpBaseUrl}/?na=s`;

    const response = await fetch(submissionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': wpBaseUrl, // Good practice to include a Referer
      },
      body: formData.toString(),
      redirect: 'follow', // Allow fetch to follow the final redirect
    });
    
    // After disabling antispam, a successful submission will redirect to a page
    // with a success parameter in the URL. We check for this.
    const finalUrl = response.url;
    
    // Check if the final URL contains the success indicators from the plugin.
    // 'nm=confirmed' for double opt-in, 'nm=subscribed' for single opt-in.
    const isSuccess = response.ok && (finalUrl.includes('nm=confirmed') || finalUrl.includes('nm=subscribed'));

    if (isSuccess) {
      // If the final URL contains 'na=E', it means the email was already subscribed.
      if (finalUrl.includes('na=E')) {
        return NextResponse.json({ message: 'This email is already subscribed.' }, { status: 200 });
      }
      return NextResponse.json({ message: 'Successfully subscribed! Please check your email to confirm.' }, { status: 200 });
    } else {
      // If the URL doesn't contain a success parameter, something went wrong on the WP side.
      throw new Error('Subscription failed on the WordPress server. Please check plugin settings.');
    }

  } catch (error: unknown) {
    console.error('Newsletter API Error:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json(
      { message: message || 'Internal Server Error' },
      { status: 500 });
  }
}
