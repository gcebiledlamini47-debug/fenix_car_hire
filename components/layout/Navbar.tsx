'use client';

import Link from 'next/link';
import { navigationLinks } from '@/data/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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
            <Link href="/" className="flex flex-col items-center gap-1 mx-auto md:mx-0">
              <div className="w-10 h-10 bg-[#00A8E8] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div className="text-center hidden sm:block">
                <span className="font-bold text-lg text-white block">Fenix Car Hire</span>
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
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-white hover:bg-white/10 ml-auto"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden pb-4 space-y-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/10 hover:text-[#00A8E8] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
