// src/components/Navbar.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, User, MapPin, Menu, X } from 'lucide-react';

const navLinks = [
  { href: "/", label: "HOME" },
  { href: "/products", label: "PRODUCT" },
  { href: "/blogs", label: "BLOG" },
  { href: "/about", label: "ABOUT US" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white text-gray-800 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* แถวบน: Logo, Search, Icons, Hamburger */}
        <div className="flex justify-between items-center py-4">
          <div className="w-1/3 lg:w-1/5">
            <Link href="/">
              <Image src="/next.svg" alt="Hampback Logo" width={150} height={50} priority />
            </Link>
          </div>

          {/* Search Bar (สำหรับจอใหญ่) */}
          <div className="hidden lg:flex w-3/5 justify-center">
            <div className="relative w-full max-w-lg">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </span>
              <input 
                type="text" 
                placeholder="SEARCH..."
                className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
          </div>

          {/* Icons (สำหรับจอใหญ่) */}
          <div className="hidden lg:flex w-1/5 justify-end items-center space-x-4">
            <button className="text-gray-600 hover:text-purple-600"><MapPin size={24} /></button>
            {/* <button className="text-gray-600 hover:text-purple-600"><User size={24} /></button> */}
          </div>

          {/* Hamburger Menu Button (สำหรับจอมือถือและแท็บเล็ต) */}
          <div className="lg:hidden">
            <button onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
              <Menu size={28} />
            </button>
          </div>
        </div>

        {/* แถวล่าง: Navigation Links (สำหรับจอใหญ่) */}
        <div className="hidden lg:flex justify-center items-center py-3 border-t">
          <ul className="flex items-center space-x-8 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-gray-600 hover:text-purple-600 tracking-widest">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-white z-50 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out lg:hidden`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-bold">Menu</h2>
          <button onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
            <X size={28} />
          </button>
        </div>
        <nav className="flex flex-col p-4">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="py-3 px-2 text-lg hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)} // ปิดเมนูเมื่อคลิก
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
