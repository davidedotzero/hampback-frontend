// src/app/api/subscribe/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // 1. ตรวจสอบข้อมูลเบื้องต้นที่ฝั่ง Next.js
    if (!email || !String(email).includes('@')) {
      return NextResponse.json({ message: 'Please enter a valid email address.' }, { status: 400 });
    }

    // 2. กำหนด URL ของ Custom Endpoint ที่เราสร้างใน WordPress
    const wpSubscribeUrl = `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/hampback/v1/subscribe`;

    // 3. ส่งข้อมูลอีเมลไปยัง WordPress
    const response = await fetch(wpSubscribeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    // 4. อ่านข้อมูลที่ WordPress ตอบกลับมา
    const responseData = await response.json();

    // 5. ถ้า WordPress ตอบว่าไม่สำเร็จ ให้ส่ง Error กลับไป
    if (!response.ok) {
        // responseData อาจจะมี message อยู่แล้ว เช่น 'This email address is already subscribed.'
        throw new Error(responseData.message || 'Failed to subscribe.');
    }

    // 6. ถ้าสำเร็จ ส่งข้อความ "Thank you..." กลับไป
    return NextResponse.json({ message: 'Thank you for subscribing!' }, { status: 200 });

  } catch (error: any) {
    console.error('Subscription API Error:', error);
    // ส่งข้อความ Error ที่ได้รับกลับไปให้หน้าเว็บ
    return NextResponse.json({ message: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
