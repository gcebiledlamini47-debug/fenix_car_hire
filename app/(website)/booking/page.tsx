import { Section } from '@/components/ui/Section';
import { BookingForm } from '@/components/forms/BookingForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book a Car | Fenix Car Hire',
  description: 'Book your vehicle with Fenix Car Hire. Simple, fast, and secure online booking system.',
};

export default function Booking() {
  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-r from-[#1a4a8d] to-[#00A8E8] text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Book Your Vehicle</h1>
        <p className="text-xl text-gray-100 max-w-3xl">
          Simple, secure, and fast online booking. Choose your vehicle and complete your reservation in minutes.
        </p>
      </Section>

      {/* Booking Form */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <BookingForm />
        </div>
      </Section>

      {/* Booking Steps */}
      <Section className="bg-white">
        <h2 className="text-3xl font-bold text-[#1a4a8d] mb-12 text-center">Booking Process</h2>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {[
              {
                num: '1',
                title: 'Fill Out the Form',
                description: 'Select your pickup and return dates, location, and preferred vehicle type.',
              },
              {
                num: '2',
                title: 'Review Pricing',
                description: 'See the total cost based on your selected dates and vehicle category.',
              },
              {
                num: '3',
                title: 'Provide Details',
                description: 'Enter your personal and driver information to complete the booking form.',
              },
              {
                num: '4',
                title: 'Confirmation',
                description: 'You\'ll receive a confirmation email with your booking details and receipt.',
              },
              {
                num: '5',
                title: 'Pick Up Your Car',
                description: 'Visit your chosen branch at the scheduled time to collect your vehicle.',
              },
            ].map((step, idx) => (
              <div key={idx} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00A8E8] text-white font-bold text-lg">
                    {step.num}
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-[#1a4a8d] mb-2">{step.title}</h3>
                  <p className="text-gray-700">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Important Information */}
      <Section>
        <h2 className="text-3xl font-bold text-[#1a4a8d] mb-8 text-center">Important Information</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-[#1a4a8d] mb-4">Requirements</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Valid driver's license (2+ years)</li>
              <li>✓ Passport or national ID</li>
              <li>✓ Credit card for deposit</li>
              <li>✓ Minimum age: 21 years</li>
              <li>✓ Insurance verification</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-[#1a4a8d] mb-4">Included in Price</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Full insurance coverage</li>
              <li>✓ Full tank of fuel</li>
              <li>✓ 24/7 roadside support</li>
              <li>✓ GPS navigation</li>
              <li>✓ Basic maintenance</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-[#1a4a8d] mb-4">Cancellation Policy</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Free cancellation up to 24hrs</li>
              <li>✓ 50% refund within 12hrs</li>
              <li>✓ No refund within 6hrs</li>
              <li>✓ Modification always free</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-[#1a4a8d] mb-4">Payment Options</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Credit/Debit cards</li>
              <li>✓ Mobile money transfers</li>
              <li>✓ Bank transfers</li>
              <li>✓ Cash at office</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Support */}
      <Section className="bg-gradient-to-r from-[#00A8E8] to-[#0087b8] text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Need Help with Your Booking?</h2>
        <p className="mb-6 text-lg">Contact us anytime - we're here to assist you</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:+26876829797"
            className="px-6 py-3 bg-white text-[#00A8E8] rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Call Us: +268 76829797
          </a>
          <a
            href="mailto:reception@fenix.co.sz"
            className="px-6 py-3 bg-white text-[#00A8E8] rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Email: reception@fenix.co.sz
          </a>
        </div>
      </Section>
    </>
  );
}
