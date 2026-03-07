import { Section } from '@/components/ui/Section';
import { VehicleGrid } from '@/components/features/VehicleGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fleet | Fenix Car Hire Eswatini',
  description: 'Browse our complete fleet of vehicles available in Eswatini. See availability and book your car today.',
};

export default function Fleet() {
  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-r from-[#1a4a8d] to-[#00A8E8] text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Fleet</h1>
        <p className="text-xl text-gray-100 max-w-3xl">
          Choose from our diverse selection of well-maintained vehicles available throughout Eswatini.
        </p>
      </Section>

      {/* Fleet Grid */}
      <Section>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-[#1a4a8d] mb-4">Available Vehicles</h2>
          <p className="text-gray-700 text-lg mb-4">
            All our vehicles are regularly inspected and maintained to the highest standards. Each vehicle shows its current availability status:
          </p>
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 bg-green-500 rounded-full"></span>
              <span className="text-gray-700">Available for booking</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 bg-red-500 rounded-full"></span>
              <span className="text-gray-700">Currently booked</span>
            </div>
          </div>
        </div>
        <VehicleGrid />
      </Section>

      {/* Fleet Information */}
      <Section className="bg-white">
        <h2 className="text-3xl font-bold text-[#1a4a8d] mb-8 text-center">Fleet Information</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-[#1a4a8d] mb-4">What's Included?</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-[#00A8E8] font-bold">✓</span>
                <span>Full tank of fuel</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#00A8E8] font-bold">✓</span>
                <span>Comprehensive insurance coverage</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#00A8E8] font-bold">✓</span>
                <span>24/7 roadside assistance</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#00A8E8] font-bold">✓</span>
                <span>Basic maintenance & repairs</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#00A8E8] font-bold">✓</span>
                <span>GPS navigation system</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#1a4a8d] mb-4">Requirements</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-[#1a4a8d] font-bold">•</span>
                <span>Valid driver's license (at least 2 years old)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1a4a8d] font-bold">•</span>
                <span>Passport or national ID</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1a4a8d] font-bold">•</span>
                <span>Credit card for security deposit</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1a4a8d] font-bold">•</span>
                <span>Proof of insurance (if bringing own vehicle)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1a4a8d] font-bold">•</span>
                <span>Minimum age: 21 years old</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Contact Section */}
      <Section className="bg-[#1a4a8d] text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Book Your Car?</h2>
        <p className="text-lg text-gray-100 mb-6 max-w-2xl mx-auto">
          Contact us for pricing information and special offers. Our team is available 24/7 in Eswatini.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <a href="tel:+26824221045" className="px-6 py-3 bg-[#00A8E8] text-white rounded-lg font-bold hover:bg-[#0087b8] transition-colors">
            Call: +268 24221045
          </a>
          <a href="https://wa.me/26876829797" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors">
            WhatsApp: +268 76829797
          </a>
        </div>
      </Section>
    </>
  );
}
