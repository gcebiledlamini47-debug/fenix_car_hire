'use client';

import Link from 'next/link';
import { navigationLinks } from '@/data/navigation';

export function Navbar() {
  return (
    <nav 
      className="sticky top-0 z-50 bg-cover bg-center shadow-lg"
      style={{ backgroundImage: 'url(/images/hero-car-bg.jpg)' }}
    >
      <div className="bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left Navigation */}
            <div className="hidden md:flex items-center gap-1 flex-1">
              {navigationLinks.slice(0, 3).map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-[#00A8E8] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Centered Logo */}
            <Link href="/" className="flex flex-col items-center gap-1 mx-auto">
              <div className="w-10 h-10 bg-[#00A8E8] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div className="text-center">
                <span className="font-bold text-lg text-white block">Fenix Car Hire</span>
                <span className="text-xs text-[#00A8E8] font-semibold">For all your rental needs</span>
              </div>
            </Link>

            {/* Right Navigation */}
            <div className="hidden md:flex items-center gap-1 flex-1 justify-end">
              {navigationLinks.slice(3).map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-[#00A8E8] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-md text-white hover:bg-white/10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
