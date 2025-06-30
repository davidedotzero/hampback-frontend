// src/components/layout/Footer.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');

    if (!validateEmail(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong.');
      }
      
      setStatus('success');
      setMessage('Thank you for subscribing!');
      setEmail('');

    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <section 
      className="relative bg-cover bg-center py-16 sm:py-20" 
      style={{ backgroundImage: "url('/footer-bg.jpg')" }}
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
              
              {/* THE FIX: Add noValidate to the form to bypass default browser validation */}
              <form onSubmit={handleSubmit} noValidate className="flex flex-col items-start gap-2">
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                  <input 
                    type="email" 
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'loading'}
                    className="w-full sm:flex-grow border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:bg-gray-100"
                    required
                  />
                  <button 
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full sm:w-auto bg-gray-800 text-white font-bold rounded-lg px-6 py-3 hover:bg-gray-700 transition-colors flex items-center justify-center disabled:bg-gray-400"
                  >
                    {status === 'loading' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Sign up'
                    )}
                  </button>
                </div>
                {message && (
                  <p className={`mt-2 text-sm ${status === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                    {message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
