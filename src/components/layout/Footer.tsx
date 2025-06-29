// src/components/Footer.tsx
"use client";

import { useState, FormEvent } from 'react';
import Image from 'next/image';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong.');
      }
      
      setMessage(data.message);
      setEmail(''); // เคลียร์ช่อง input เมื่อสำเร็จ

    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section 
      className="relative bg-cover bg-center py-16 sm:py-20" 
      // style={{ backgroundImage: "url('/footer-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative container mx-auto px-4 z-10">
        <div className="bg-white rounded-xl shadow-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <Image
                src="/hampback-logo.svg"
                alt="Hampback Logo"
                width={200}
                height={70}
                className="object-contain"
              />
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Don't miss out!
              </h2>
              <p className="text-gray-600 mb-6">
                Be the first to know about new products, featured content, and exclusive offers.
              </p>
              
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2">
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full sm:flex-grow border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  required
                  disabled={isLoading}
                />
                <button 
                  type="submit"
                  className="w-full sm:w-auto bg-gray-800 text-white font-bold rounded-lg px-6 py-3 hover:bg-gray-700 transition-colors disabled:bg-gray-400"
                  disabled={isLoading}
                >
                  {isLoading ? 'Subscribing...' : 'Sign up'}
                </button>
              </form>
              {message && <p className="text-sm mt-4 text-center md:text-left">{message}</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
