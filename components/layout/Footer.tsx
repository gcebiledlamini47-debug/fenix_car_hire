import Link from 'next/link';
import { navigationLinks } from '@/data/navigation';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a4a8d] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#1a4a8d] font-bold">F</span>
              </div>
              <span className="font-bold text-lg">Fenix Car Hire</span>
            </div>
            <p className="text-gray-300 text-sm">Your trusted partner for reliable and affordable car rentals across Tanzania.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navigationLinks.map((link) => (
                <li key={link.id}>
                  <Link href={link.href} className="text-gray-300 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Airport Transfers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Long-term Rental</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Corporate Packages</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Insurance Options</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="tel:+255756123456" className="hover:text-white transition-colors">+255 756 123 456</a></li>
              <li><a href="mailto:info@fenixcarhire.com" className="hover:text-white transition-colors">info@fenixcarhire.com</a></li>
              <li>Dar es Salaam, Tanzania</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-500 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">&copy; {currentYear} Fenix Car Hire. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/terms" className="text-gray-300 hover:text-white text-sm transition-colors">
                Terms & Conditions
              </Link>
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
