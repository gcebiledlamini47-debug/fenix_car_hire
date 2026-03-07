import { Section } from '@/components/ui/Section';
import { VehicleGrid } from '@/components/features/VehicleGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fleet | Fenix Car Hire',
  description: 'Browse our complete fleet of vehicles ranging from economy to luxury cars.',
};

export default function Fleet() {
  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-r from-[#1a4a8d] to-[#00A8E8] text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Fleet</h1>
        <p className="text-xl text-gray-100 max-w-3xl">
          Choose from our diverse selection of well-maintained vehicles for every occasion.
        </p>
      </Section>

      {/* Fleet Grid */}
      <Section>
        <div className="mb-10">
          <p className="text-gray-700 text-lg">
            All our vehicles are regularly inspected and maintained to the highest standards. Select a vehicle below to see
            detailed specifications and pricing.
          </p>
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

      {/* Pricing Information */}
      <Section>
        <h2 className="text-3xl font-bold text-[#1a4a8d] mb-8 text-center">Pricing Options</h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-[#1a4a8d] mb-4">Daily Rates</h3>
            <p className="text-gray-700 mb-4">Perfect for short trips and weekend getaways</p>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li>✓ Flexible duration</li>
              <li>✓ No long-term commitment</li>
              <li>✓ Full insurance included</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-[#00A8E8]">
            <h3 className="text-2xl font-bold text-[#00A8E8] mb-4">Weekly Rates</h3>
            <p className="text-gray-700 mb-4">Great savings on weekly rentals</p>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li>✓ 20% discount</li>
              <li>✓ Extended flexibility</li>
              <li>✓ Free mileage</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-[#1a4a8d] mb-4">Monthly Rates</h3>
            <p className="text-gray-700 mb-4">Best value for long-term rentals</p>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li>✓ 35% discount</li>
              <li>✓ Maintenance included</li>
              <li>✓ Unlimited mileage</li>
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
