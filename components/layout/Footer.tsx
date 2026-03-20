import Link from 'next/link';
import { navigationLinks } from '@/data/navigation';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a4a8d] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#1a4a8d] font-bold">F</span>
              </div>
              <span className="font-bold text-base sm:text-lg">Fenix Car Hire Eswatini</span>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm mb-4">Your trusted partner for reliable and affordable car rentals in Eswatini.</p>
            <div className="flex gap-4">
              <a 
                href="https://www.facebook.com/fenixcarhire.eswatini" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#00A8E8] hover:text-white transition-colors text-xs sm:text-sm font-semibold"
              >
                Facebook
              </a>
              <a 
                href="https://wa.me/26876829797" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#00A8E8] hover:text-white transition-colors text-xs sm:text-sm font-semibold"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4 text-sm sm:text-base">Quick Links</h3>
            <ul className="space-y-2">
              {navigationLinks.map((link) => (
                <li key={link.id}>
                  <Link href={link.href} className="text-gray-300 hover:text-white transition-colors text-xs sm:text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold mb-4 text-sm sm:text-base">Services</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Airport Transfers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Long-term Rental</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Corporate Packages</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Insurance Options</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4 text-sm sm:text-base">Contact</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
              <li><a href="tel:+26824221045" className="hover:text-white transition-colors">Tel: +268 2422</a></li>
              <li><a href="tel:+26876829797" className="hover:text-white transition-colors">Mobile: +268 7682</a></li>
              <li><a href="https://wa.me/26876829797" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp: +268</a></li>
              <li><a href="mailto:reception@fenix.co.sz" className="hover:text-white transition-colors break-all">reception@fenix.co.sz</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-500 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-300 text-xs sm:text-sm text-center sm:text-left">&copy; {currentYear} Fenix Car Hire Eswatini. All rights reserved.</p>
            <div className="flex gap-4 sm:gap-6 text-center sm:text-right">
              <Link href="/terms" className="text-gray-300 hover:text-white text-xs sm:text-sm transition-colors">
                Terms & Conditions
              </Link>
              <a href="#" className="text-gray-300 hover:text-white text-xs sm:text-sm transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
