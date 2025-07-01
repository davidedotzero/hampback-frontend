# Hampback Frontend

![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?style=for-the-badge&logo=next.js) ![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-cyan?style=for-the-badge&logo=tailwind-css)

## เกี่ยวกับโปรเจกต์

โปรเจกต์นี้คือส่วน Frontend ของเว็บไซต์ Hampback Music Gear ที่สร้างขึ้นด้วยสถาปัตยกรรมแบบ **Headless** โดยใช้ **Next.js** เป็นเฟรมเวิร์กหลักในการสร้างหน้าเว็บ และดึงข้อมูลสินค้าทั้งหมดมาจาก **WordPress และ WooCommerce** ผ่านทาง REST API

เว็บไซต์นี้ถูกออกแบบมาเพื่อนำเสนอข้อมูลสินค้า, ข่าวสาร, และเป็นช่องทางในการค้นหาตัวแทนจำหน่ายของ Hampback

---

## เทคโนโลยีหลัก (Tech Stack)

* **Framework:** [Next.js](https://nextjs.org/)
* **UI Library:** [React](https://react.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **3D Graphics & Animations:** [Three.js](https://threejs.org/), [Swiper.js](https://swiperjs.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Interactive Maps:** [React Leaflet](https://react-leaflet.js.org/)
* **Security:** [DOMPurify](https://github.com/cure53/DOMPurify) (สำหรับป้องกัน XSS)

สำหรับรายชื่อ Dependencies ทั้งหมด สามารถดูได้ที่ไฟล์ `package.json`

---

## ฟีเจอร์หลัก

* **Interactive Hero Section:** Hero section แบบ 3D Carousel ที่สร้างด้วย Three.js เพื่อประสบการณ์ที่น่าดึงดูด
* **Product Catalog:** แสดงรายการสินค้าทั้งหมดพร้อมระบบกรองและเรียงลำดับ
* **Product Detail Page:** หน้าแสดงรายละเอียดสินค้าแบบเจาะลึก พร้อมแกลเลอรี, วิดีโอ, และข้อมูลจำเพาะ
* **Instant Search:** ระบบค้นหาสินค้าแบบทันที (Real-time) จาก Navbar
* **Wishlist:** ระบบบันทึกสินค้าที่ชื่นชอบไว้ในเบราว์เซอร์ของผู้ใช้
* **Dealer Locator:** หน้าสำหรับค้นหาตัวแทนจำหน่าย พร้อมแผนที่แบบ Interactive
* **Technical SEO:** ปรับปรุง SEO ด้วย Dynamic Sitemap และ Structured Data (JSON-LD)

---

## การติดตั้งและเริ่มต้นใช้งาน

### ข้อกำหนดเบื้องต้น

* [Node.js](https://nodejs.org/) (เวอร์ชัน 18.18.0 หรือสูงกว่า)
* `npm`, `yarn`, หรือ `pnpm`

### ขั้นตอนการติดตั้ง

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/davidedotzero/hampback-frontend.git](https://github.com/davidedotzero/hampback-frontend.git)
    cd hampback-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **ตั้งค่า Environment Variables:**
    สร้างไฟล์ใหม่ชื่อ `.env.local` ที่รากของโปรเจกต์ และใส่ข้อมูลที่จำเป็น:

    ```env
    # .env.local

    # URL ของ WordPress REST API
    NEXT_PUBLIC_WORDPRESS_API_URL=[https://your-wordpress-site.com/wp-json](https://your-wordpress-site.com/wp-json)

    # WooCommerce API Keys
    WOOCOMMERCE_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxxxxxx
    WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxxxxxx
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    เปิด [http://localhost:3000](http://localhost:3000) บนเบราว์เซอร์ของคุณเพื่อดูผลลัพธ์

---

## คำสั่ง (Scripts) ที่มีให้ใช้

* `npm run dev`: รันแอปพลิเคชันในโหมดพัฒนา
* `npm run build`: สร้างโปรเจกต์สำหรับ Production
* `npm run start`: รันแอปพลิเคชันจากเวอร์ชันที่ build แล้ว
* `npm run lint`: ตรวจสอบคุณภาพของโค้ดด้วย ESLint

---

## การ Deploy

วิธีที่ง่ายและแนะนำที่สุดในการ Deploy โปรเจกต์ Next.js คือการใช้ [Vercel Platform](https://vercel.com/new)
