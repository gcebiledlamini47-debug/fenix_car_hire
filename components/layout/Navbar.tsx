'use client';

import { useState } from 'react';
import Link from 'next/link';
import { navigationLinks } from '@/data/navigation';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav 
      className="sticky top-0 z-50 bg-gradient-to-r from-[#1a4a8d] to-[#00A8E8] shadow-lg"
    >
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Mobile Menu Button - Left side on mobile */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md text-white hover:bg-white/20 transition-colors"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* Left Navigation - Desktop */}
            <div className="hidden md:flex items-center gap-4 flex-1">
              {navigationLinks.slice(0, 3).map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="px-5 py-2 rounded-lg text-lg font-extrabold text-white hover:text-yellow-300 hover:bg-white/20 transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Centered Logo */}
            <Link href="/" className="flex flex-col items-center gap-1" onClick={closeMobileMenu}>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#1a4a8d] font-bold text-lg">F</span>
              </div>
              <span className="font-bold text-lg text-white">Fenix Car Hire</span>
            </Link>

            {/* Right Navigation - Desktop */}
            <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
              {navigationLinks.slice(3).map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="px-5 py-2 rounded-lg text-lg font-extrabold text-white hover:text-yellow-300 hover:bg-white/20 transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Spacer for mobile to center logo */}
            <div className="md:hidden w-10"></div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 pb-4 space-y-1 border-t border-white/20 bg-[#1a4a8d]">
            {navigationLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                onClick={closeMobileMenu}
                className="block px-4 py-3 rounded-lg text-white hover:bg-white/20 hover:text-yellow-300 transition-all font-extrabold text-lg"
              >
                {link.label}
              </Link>
            ))}
            
            {/* Quick Contact in Mobile Menu */}
            <div className="pt-4 mt-4 border-t border-white/20">
              <p className="px-4 text-xs text-white/70 uppercase tracking-wide mb-2">Quick Contact</p>
              <a
                href="tel:+26824221045"
                className="block px-4 py-2 text-yellow-300 hover:text-white transition-colors"
              >
                +268 24221045
              </a>
              <a
                href="mailto:reception@fenix.co.sz"
                className="block px-4 py-2 text-yellow-300 hover:text-white transition-colors"
              >
                reception@fenix.co.sz
              </a>
              <a
                href="https://www.facebook.com/share/1Gc2H9AFaJ/"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 text-yellow-300 hover:text-white transition-colors"
              >
                Follow us on Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
