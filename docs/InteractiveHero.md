# เอกสารอธิบาย `InteractiveHero` Component

`InteractiveHero` เป็น React client component (`"use client"`) ที่ถูกออกแบบมาเพื่อสร้างประสบการณ์ที่น่าดึงดูดและโต้ตอบได้สำหรับส่วน Hero Section ของเว็บไซต์ โดยใช้ Three.js เพื่อแสดงผลภาพสินค้าในรูปแบบ 3D Carousel

## ภาพรวมการทำงาน

Component นี้จะรับข้อมูลรูปภาพ (heroImages) มาแสดงผลเป็นแผ่นภาพ (planes) ที่จัดเรียงเป็นวงกลมในโลก 3 มิติ ผู้ใช้สามารถโต้ตอบกับ Carousel ได้ 2 วิธีหลัก:

1.  **คลิกที่จุด Navigation:** เพื่อเปลี่ยนไปยังรูปภาพที่ต้องการ
2.  **เลื่อนเมาส์ในแนวนอน:** เพื่อหมุน Carousel ไปทางซ้ายหรือขวาเล็กน้อย (Parallax effect)

Carousel จะหมุนไปยังภาพที่ถูกเลือกอย่างนุ่มนวล พร้อมทั้งปรับความโปร่งใส (Opacity) เพื่อเน้นภาพที่กำลังแสดงอยู่

---

## เทคโนโลยีหลัก

*   **React:** ใช้ Hooks ต่างๆ ในการจัดการ State, Side Effects, และ DOM References
    *   `useState`: จัดการ `activeIndex` เพื่อติดตามว่าภาพไหนกำลังถูกแสดง
    *   `useRef`:
        *   `mountRef`: อ้างอิงไปยัง DOM element ที่จะใช้เป็นพื้นที่แสดงผล (canvas) ของ Three.js
        *   `baseRotation`: เก็บค่ามุมการหมุนหลักของ Carousel
        *   `mouseRotationOffset`: เก็บค่ามุมการหมุนที่เกิดจากการขยับเมาส์
    *   `useEffect`: เป็นหัวใจหลักในการสร้างและจัดการ Scene ของ Three.js ทั้งหมด รวมถึงการทำ Cleanup เพื่อป้องกัน Memory Leaks
    *   `useCallback`: ใช้กับฟังก์ชัน `handleDotClick` เพื่อ performance optimization
*   **Three.js:** ไลบรารีสำหรับสร้างและแสดงผลกราฟิก 3D บนเว็บ

---

## การทำงานเชิงลึก

การทำงานทั้งหมดเกิดขึ้นภายใน `useEffect` hook ซึ่งจะทำงานเมื่อ component ถูก mount และเมื่อ `heroImages` หรือ `activeIndex` มีการเปลี่ยนแปลง

### 1. การตั้งค่า Scene (Setup Phase)

*   **ตรวจสอบเงื่อนไข:** เช็คว่า `mountRef` พร้อมใช้งานและมีข้อมูล `heroImages` หรือไม่ ถ้าไม่ ก็จะหยุดการทำงาน
*   **สร้างองค์ประกอบหลัก:** สร้าง `Scene`, `PerspectiveCamera`, และ `WebGLRenderer`
*   **กำหนดค่า Renderer:** ตั้งค่าขนาดของ Renderer ให้พอดีกับ `mountRef`, เปิด `antialias` เพื่อความสวยงาม, `alpha: true` เพื่อให้พื้นหลังโปร่งใส, และตั้งค่า `pixelRatio` ให้เหมาะสมกับหน้าจอ
*   **เพิ่ม Canvas ไปยัง DOM:** นำ `renderer.domElement` (ซึ่งก็คือ `<canvas>`) ไปใส่ใน `mountRef` เพื่อให้แสดงผลบนหน้าเว็บ

### 2. การสร้าง Object (Object Creation)

*   **สร้าง Group:** สร้าง `THREE.Group` เพื่อใช้จัดการแผ่นภาพทั้งหมดเป็นกลุ่มก้อนเดียวกัน
*   **วนลูปสร้างแผ่นภาพ:** วนลูปข้อมูล `heroImages` แต่ละอันเพื่อ:
    1.  **โหลด Texture:** ใช้ `TextureLoader` โหลดรูปภาพผ่าน Image Proxy (`/api/image-proxy`) การใช้ Proxy ช่วยแก้ปัญหา CORS และช่วยให้สามารถควบคุมการเข้าถึงรูปภาพจากภายนอกได้
    2.  **สร้าง Material:** สร้าง `MeshBasicMaterial` โดยใช้ Texture ที่โหลดมา ตั้งค่า `transparent: true` เพื่อให้สามารถปรับ opacity ได้
    3.  **สร้าง Geometry:** สร้าง `PlaneGeometry` (แผ่นสี่เหลี่ยม)
    4.  **สร้าง Mesh:** รวม Geometry และ Material เข้าด้วยกันเป็น `THREE.Mesh` (Object ที่จะแสดงผลได้)
    5.  **กำหนดตำแหน่ง:** คำนวณตำแหน่งของแต่ละแผ่นภาพโดยใช้วงกลม (Trigonometry: `Math.sin`, `Math.cos`) เพื่อให้เรียงตัวเป็น Carousel
    6.  **เพิ่มเข้า Group:** นำ Mesh ที่สร้างเสร็จแล้วเพิ่มเข้าไปใน `group`

### 3. การคำนวณการหมุน (Rotation Logic)

*   เมื่อ `activeIndex` เปลี่ยน, โค้ดจะคำนวณมุมเป้าหมายใหม่ (`newTargetAngle`)
*   มีการใช้ตรรกะเพื่อหาเส้นทางการหมุนที่สั้นที่สุด (Shortest path) เพื่อไม่ให้ Carousel หมุนครบรอบโดยไม่จำเป็น
*   อัปเดตค่า `baseRotation.current` เพื่อใช้ใน Animation Loop ต่อไป

### 4. Animation และ Interaction

*   **`animate()` Loop:** สร้างฟังก์ชัน `animate` ที่จะถูกเรียกซ้ำๆ ผ่าน `requestAnimationFrame` เพื่อสร้างภาพเคลื่อนไหวที่ลื่นไหล
*   **การหมุน:** ในแต่ละเฟรม จะคำนวณมุมการหมุนสุดท้าย (`finalTargetRotation`) โดยการนำ `baseRotation` (จากการคลิก) มารวมกับ `mouseRotationOffset` (จากการขยับเมาส์)
*   **`lerp()` (Linear Interpolation):** ใช้ฟังก์ชัน `lerp` เพื่อค่อยๆ เปลี่ยนค่าการหมุนและ opacity ไปยังค่าเป้าหมาย ทำให้การเคลื่อนไหวดูนุ่มนวล (smooth) ไม่กระตุก
*   **`lookAt()`:** ทำให้แผ่นภาพทุกอันหันหน้าเข้าหากล้องตลอดเวลา
*   **Event Listeners:**
    *   `mousemove`: อัปเดตค่า `mouseRotationOffset` ตามตำแหน่งของเมาส์
    *   `resize`: ปรับขนาดของ Renderer และ Camera เมื่อขนาดหน้าต่างเบราว์เซอร์เปลี่ยนไป

### 5. การ Cleanup

*   `useEffect` จะ return cleanup function ซึ่งจะทำงานเมื่อ component ถูก unmount
*   **สำคัญมาก:** ส่วนนี้จะทำการลบ Event Listeners และที่สำคัญที่สุดคือการคืน Memory ให้กับระบบโดยการเรียกใช้เมธอด `.dispose()` บน `renderer` และ `geometries`, `materials` ทั้งหมดที่สร้างขึ้น เพื่อป้องกันปัญหา **Memory Leak**

---

## การแสดงผล (JSX)

*   `div` ที่มี `ref={mountRef}` ทำหน้าที่เป็น Container สำหรับ Canvas ของ Three.js
*   ส่วนของข้อความ (Product Name, Category) จะแสดงอยู่ด้านบน (z-index สูงกว่า) และข้อมูลจะอัปเดตตาม `activeImage`
*   มีการใช้ `key` ที่ผูกกับ `activeIndex` บน `<h1>` และ `<p>` เพื่อช่วยให้ React ทำ transition ได้อย่างถูกต้องเมื่อข้อความเปลี่ยน
*   ส่วนของ Dot Navigation จะสร้างปุ่มตามจำนวน `heroImages` และผูก `onClick` กับฟังก์ชัน `handleDotClick`

---

## ตัวอย่างการใช้งาน

```jsx
// src/app/page.tsx

import InteractiveHero from '@/components/home/InteractiveHero';

// สมมติว่ามีฟังก์ชันสำหรับดึงข้อมูลรูปภาพ
async function getHeroImages(): Promise<HeroImage[]> {
  // ... logic การ fetch ข้อมูล
}

export default async function HomePage() {
  const heroImages = await getHeroImages();

  return (
    <>
      <InteractiveHero heroImages={heroImages} />
      {/* ... ส่วนอื่นๆ ของหน้า ... */}
    </>
  );
}
```