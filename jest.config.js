// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // ระบุ path ไปยังแอป Next.js ของคุณเพื่อโหลดไฟล์ next.config.js และ .env
  dir: './',
});

// เพิ่มการตั้งค่าของ Jest เอง
/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  preset: 'ts-jest',
};

module.exports = createJestConfig(customJestConfig);