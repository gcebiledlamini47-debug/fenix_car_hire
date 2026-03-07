import { Section } from '@/components/ui/Section';
import { ServiceCard } from '@/components/features/ServiceCard';
import { Card } from '@/components/ui/Card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services | Fenix Car Hire',
  description: 'Explore our comprehensive car rental services including airport transfers, long-term rentals, and corporate packages.',
};

export default function Services() {
  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-r from-[#1a4a8d] to-[#00A8E8] text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
        <p className="text-xl text-gray-100 max-w-3xl">
          Comprehensive car rental solutions tailored to meet your specific needs.
        </p>
      </Section>

      {/* Services Grid */}
      <Section>
        <ServiceCard />
      </Section>

      {/* Additional Services */}
      <Section className="bg-white">
        <h2 className="text-3xl font-bold text-[#1a4a8d] mb-12 text-center">Special Services</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-2xl font-bold text-[#1a4a8d] mb-4">Airport Transfers</h3>
            <p className="text-gray-700 mb-4">
              Convenient airport pickup and drop-off services with professional drivers. We monitor your flight status
              and adjust timing accordingly.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✓ Flight tracking</li>
              <li>✓ Professional drivers</li>
              <li>✓ Luggage assistance</li>
              <li>✓ Fixed pricing</li>
            </ul>
          </Card>

          <Card>
            <h3 className="text-2xl font-bold text-[#1a4a8d] mb-4">Corporate Packages</h3>
            <p className="text-gray-700 mb-4">
              Customized solutions for businesses with flexible contracts, bulk discounts, and dedicated account
              management.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✓ Bulk discounts</li>
              <li>✓ Monthly contracts</li>
              <li>✓ Fleet options</li>
              <li>✓ Dedicated support</li>
            </ul>
          </Card>

          <Card>
            <h3 className="text-2xl font-bold text-[#1a4a8d] mb-4">Long-term Rentals</h3>
            <p className="text-gray-700 mb-4">
              Perfect for extended stays with significant discounts on weekly and monthly rates. Maintenance included.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✓ Discounted rates</li>
              <li>✓ Maintenance included</li>
              <li>✓ Flexible terms</li>
              <li>✓ Insurance coverage</li>
            </ul>
          </Card>

          <Card>
            <h3 className="text-2xl font-bold text-[#1a4a8d] mb-4">Event Services</h3>
            <p className="text-gray-700 mb-4">
              Full vehicle support for weddings, conferences, and special events. We handle logistics so you can focus
              on your event.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✓ Multiple vehicles</li>
              <li>✓ Professional drivers</li>
              <li>✓ Custom itineraries</li>
              <li>✓ Competitive rates</li>
            </ul>
          </Card>

          <Card>
            <h3 className="text-2xl font-bold text-[#1a4a8d] mb-4">Insurance & Safety</h3>
            <p className="text-gray-700 mb-4">
              Comprehensive insurance coverage options with 24/7 roadside assistance and GPS tracking for your
              security.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✓ Full coverage available</li>
              <li>✓ Roadside assistance</li>
              <li>✓ GPS tracking</li>
              <li>✓ Emergency support</li>
            </ul>
          </Card>

          <Card>
            <h3 className="text-2xl font-bold text-[#1a4a8d] mb-4">Regional Coverage</h3>
            <p className="text-gray-700 mb-4">
              Pick up and drop off at multiple locations across Eswatini. Regional offices ensure convenient service
              nationwide.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>4 regional branches</li>
              <li>Nationwide coverage</li>
              <li>One-way rentals</li>
              <li>Same-day service</li>
            </ul>
          </Card>
        </div>
      </Section>

      {/* How It Works */}
      <Section>
        <h2 className="text-3xl font-bold text-[#1a4a8d] mb-12 text-center">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              num: '1',
              title: 'Choose Your Vehicle',
              description: 'Browse our fleet and select the perfect car for your needs',
            },
            {
              num: '2',
              title: 'Book & Confirm',
              description: 'Fill out our simple booking form and confirm your reservation',
            },
            {
              num: '3',
              title: 'Pick Up',
              description: 'Visit your nearest branch or request delivery service',
            },
            {
              num: '4',
              title: 'Enjoy & Return',
              description: 'Drive safely and return the vehicle at your convenience',
            },
          ].map((step, idx) => (
            <div key={idx} className="text-center">
              <div className="w-16 h-16 bg-[#00A8E8] text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                {step.num}
              </div>
              <h3 className="text-lg font-bold text-[#1a4a8d] mb-2">{step.title}</h3>
              <p className="text-gray-700 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
