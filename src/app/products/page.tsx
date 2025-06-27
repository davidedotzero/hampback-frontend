import { Product } from '@/types/product';


async function getAllProducts(): Promise<Product[]> {
  const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
  const productsApiUrl = `${wpApiBaseUrl}/wc/v3/products?per_page=100`;

  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || '';
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || '';

  // Log เพื่อตรวจสอบว่าอ่านค่า key มาจาก .env หรือไม่
  console.log("Using Consumer Key:", consumerKey ? `ck_...${consumerKey.slice(-5)}` : "Key not found!");
  
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  
  try {
    const response = await fetch(productsApiUrl, {
      headers: { 'Authorization': `Basic ${auth}` },
      cache: 'no-store', // เพิ่ม cache: 'no-store' ชั่วคราวเพื่อการดีบัก
    });

    // ถ้าไม่สำเร็จ ให้ Log ข้อความจาก Server ออกมาดู
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to fetch products. Status:", response.status);
      console.error("Error details from WooCommerce:", errorData);
      throw new Error('Failed to fetch products');
    }
    
    console.log("Successfully fetched products!");
    return await response.json();
  } catch (error) {
    console.error("Error during product fetch operation:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const initialProducts = await getAllProducts();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Render your products here */}
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <ul>
        {initialProducts.map(product => (
          <li key={product.id} className="mb-4">
            <h2 className="text-xl">{product.name}</h2>
            <p>{product.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

