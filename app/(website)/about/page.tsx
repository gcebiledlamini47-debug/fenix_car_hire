import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Fenix Car Hire',
  description: 'Learn about Fenix Car Hire, our mission, values, and commitment to excellent service.',
};

export default function About() {
  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-r from-[#1a4a8d] to-[#00A8E8] text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Fenix Car Hire</h1>
        <p className="text-xl text-gray-100 max-w-3xl">
          Your trusted partner for reliable and affordable car rental services since 2015.
        </p>
      </Section>

      {/* Our Story */}
      <Section>
        <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-[#1a4a8d] mb-4">Our Story</h2>
            <p className="text-gray-700 mb-4">
              Founded in 2015, Fenix Car Hire started with a simple mission: to provide reliable, affordable, and
              professional car rental services to travelers across Tanzania.
            </p>
            <p className="text-gray-700 mb-4">
              What began as a small fleet of vehicles has grown into one of the most trusted car rental companies in the
              region, serving thousands of satisfied customers every year.
            </p>
            <p className="text-gray-700">
              We believe in building long-term relationships with our customers by delivering exceptional service,
              maintaining our fleet to the highest standards, and always putting your needs first.
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#1a4a8d] to-[#00A8E8] rounded-lg h-96 flex items-center justify-center text-white text-6xl">
            🚗
          </div>
        </div>
      </Section>

      {/* Mission, Vision, Values */}
      <Section className="bg-white">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a4a8d] text-center mb-12">Our Values</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <h3 className="text-2xl font-bold text-[#1a4a8d] mb-4">🎯 Our Mission</h3>
            <p className="text-gray-700">
              To provide exceptional car rental services that exceed customer expectations, offering the perfect vehicle
              at the right price with professional, friendly service.
            </p>
          </Card>
          <Card>
            <h3 className="text-2xl font-bold text-[#1a4a8d] mb-4">🌟 Our Vision</h3>
            <p className="text-gray-700">
              To be the leading car rental company in East Africa, recognized for reliability, innovation, and customer
              satisfaction.
            </p>
          </Card>
          <Card>
            <h3 className="text-2xl font-bold text-[#1a4a8d] mb-4">💎 Our Principles</h3>
            <p className="text-gray-700">
              Integrity, reliability, customer focus, and continuous improvement. We're committed to honest dealings,
              maintaining quality, and always listening to our customers.
            </p>
          </Card>
        </div>
      </Section>

      {/* Why Choose Us */}
      <Section>
        <h2 className="text-3xl font-bold text-[#1a4a8d] mb-12 text-center">Why Choose Fenix Car Hire?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              icon: '✓',
              title: 'Professional Team',
              description: 'Our experienced staff is trained to provide excellent customer service.',
            },
            {
              icon: '✓',
              title: 'Quality Fleet',
              description: 'All vehicles are regularly maintained and inspected for safety.',
            },
            {
              icon: '✓',
              title: 'Competitive Pricing',
              description: 'We offer the best rates without compromising on quality.',
            },
            {
              icon: '✓',
              title: '24/7 Support',
              description: 'Our team is available anytime to assist you with any issues.',
            },
            {
              icon: '✓',
              title: 'Flexible Options',
              description: 'Short-term, long-term, or corporate rentals - we have solutions for all.',
            },
            {
              icon: '✓',
              title: 'Transparent Pricing',
              description: 'No hidden charges, just honest pricing and clear terms.',
            },
          ].map((item, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="text-3xl font-bold text-[#00A8E8] flex-shrink-0">{item.icon}</div>
              <div>
                <h3 className="text-lg font-bold text-[#1a4a8d] mb-2">{item.title}</h3>
                <p className="text-gray-700">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Team Section */}
      <Section className="bg-white">
        <h2 className="text-3xl font-bold text-[#1a4a8d] mb-12 text-center">Our Team</h2>
        <p className="text-center text-gray-700 mb-8 max-w-2xl mx-auto">
          Our dedicated team of professionals is committed to making your car rental experience smooth, convenient, and
          enjoyable.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { role: 'General Manager', name: 'John Ndege', icon: '👔' },
            { role: 'Fleet Manager', name: 'Maria Kamau', icon: '🛠️' },
            { role: 'Customer Service Lead', name: 'David Mwangi', icon: '😊' },
          ].map((member, idx) => (
            <Card key={idx} hover={false}>
              <div className="text-6xl text-center mb-4">{member.icon}</div>
              <h3 className="text-lg font-bold text-[#1a4a8d] text-center mb-1">{member.name}</h3>
              <p className="text-center text-gray-600 text-sm">{member.role}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
