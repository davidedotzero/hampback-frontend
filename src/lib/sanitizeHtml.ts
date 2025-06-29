// src/lib/sanitizeHtml.ts
import DOMPurify from 'dompurify';

/**
 * ฟังก์ชันสำหรับกรองโค้ด HTML ที่ไม่ปลอดภัยออกไป
 * เพื่อป้องกันการโจมตีแบบ Cross-Site Scripting (XSS)
 * ก่อนที่จะนำไปใช้กับ dangerouslySetInnerHTML
 * @param dirtyHtml - HTML string ดิบที่อาจมีโค้ดอันตรายปนอยู่
 * @returns HTML string ที่ผ่านการกรองแล้ว
 */
export const sanitizeHtml = (dirtyHtml: string | undefined | null): string => {
  // ถ้าข้อมูลที่รับเข้ามาไม่มีค่า (null, undefined, or empty string) ให้ส่งค่าว่างกลับไป
  if (!dirtyHtml) {
    return '';
  }

  // DOMPurify ทำงานได้เฉพาะในสภาพแวดล้อมที่มี DOM (เช่น เบราว์เซอร์)
  // เราจึงต้องตรวจสอบก่อนว่าโค้ดกำลังรันอยู่ในฝั่ง Client หรือไม่
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(dirtyHtml);
  }

  // ถ้าโค้ดรันอยู่ที่ฝั่ง Server (ซึ่งไม่มี window object)
  // ให้ส่งค่าเดิมกลับไปก่อน เพราะการแสดงผลที่ Server จะไม่เกิด XSS
  // และการกรองจริงๆ จะเกิดขึ้นอีกครั้งเมื่อ Component ถูก hydrate ที่ฝั่ง Client
  return dirtyHtml;
};
