// src/components/Footer.tsx
import Image from 'next/image';

export default function Footer() {
  return (
    <section 
      className="relative bg-cover bg-center py-16 sm:py-20" 
      style={{ backgroundImage: "url('/footer-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative container mx-auto px-4 z-10">
        <div className="bg-white rounded-xl shadow-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* ทำให้ Logo และข้อความอยู่ตรงกลางในจอมือถือ */}
            <div className="flex flex-col gap-8 items-center md:items-start text-center md:text-left">
              <Image
                src="/hampback-logo.svg"
                alt="Hampback Logo"
                width={400}
                height={140}
                className="object-contain"
              />
            </div>

            <div className="text-center md:text-left">
              {/* ปรับขนาดตัวอักษรให้ responsive */}
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Don't miss out!
              </h2>
              <p className="text-gray-600 mb-6">
                Be the first to know about new products, featured content, and exclusive offers.
              </p>
              
              <form className="flex flex-col sm:flex-row items-center gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  className="w-full sm:flex-grow border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <button 
                  type="submit"
                  className="w-full sm:w-auto bg-gray-800 text-white font-bold rounded-lg px-6 py-3 hover:bg-gray-700 transition-colors"
                >
                  Sign up
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
