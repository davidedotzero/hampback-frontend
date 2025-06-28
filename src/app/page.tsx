// src/app/page.tsx

import Hero from '@/components/้home/Hero';
// ... import component อื่นๆ

const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

// --- ฟังก์ชันสำหรับดึงข้อมูล Hero (รูปเดียว) ---
async function getHeroData(): Promise<string | null> {
  try {
    const HOMEPAGE_ID = 2; // ใช้ ID ของหน้า Homepage ของคุณ
    
    const response = await fetch(`${wpApiBaseUrl}/wp/v2/pages/${HOMEPAGE_ID}?acf_format=standard&_fields=acf`, { 
      next: { revalidate: 60 }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch hero data.');
    }

    const pageData = await response.json();
    // ดึง URL จากฟิลด์ hero_image ที่เราตั้งค่าไว้
    return pageData?.acf?.hero || null;

  } catch (error) {
    console.error("Error fetching hero data:", error);
    return null;
  }
}

// ... (ฟังก์ชันดึงข้อมูลอื่นๆ เช่น getFeaturedProducts ไม่มีการเปลี่ยนแปลง) ...


// --- Page Component (Server Component หลัก) ---
export default async function HomePage() {
  // ดึงข้อมูล Hero ที่ฝั่ง Server
  const heroImageUrl = await getHeroData();
  // ... (ดึงข้อมูลส่วนอื่นๆ) ...

  return (
    <>
      {/* เรียกใช้ Hero component แล้วส่ง imageUrl ที่ได้เข้าไป */}
      <Hero imageUrl={heroImageUrl} />
      
      <main>
        {/* ส่วนอื่นๆ ของหน้า Homepage */}
      </main>
    </>
  );
}
