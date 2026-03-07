import { Section } from '@/components/ui/Section';
import { ContactForm } from '@/components/forms/ContactForm';
import { RegionCard } from '@/components/features/RegionCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Fenix Car Hire',
  description: 'Get in touch with Fenix Car Hire. Find our regional offices and contact information.',
};

export default function Contact() {
  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-r from-[#1a4a8d] to-[#00A8E8] text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-gray-100 max-w-3xl">
          We're here to help! Get in touch with our team for any questions or inquiries.
        </p>
      </Section>

      {/* Contact Form & Info */}
      <Section>
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Form */}
          <div>
            <h2 className="text-2xl font-bold text-[#1a4a8d] mb-6">Send us a Message</h2>
            <ContactForm />
          </div>

          {/* Quick Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-[#1a4a8d] mb-6">Quick Contact</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-[#1a4a8d] mb-3">📞 Phone</h3>
                <a href="tel:+255756123456" className="text-[#00A8E8] hover:underline text-lg font-semibold">
                  +255 756 123 456
                </a>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-[#1a4a8d] mb-3">✉️ Email</h3>
                <a href="mailto:info@fenixcarhire.com" className="text-[#00A8E8] hover:underline text-lg font-semibold">
                  info@fenixcarhire.com
                </a>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-[#1a4a8d] mb-3">📍 Main Office</h3>
                <p className="text-gray-700">
                  Dar es Salaam, Tanzania
                  <br />
                  Operating Hours: Mon-Sun, 8am - 6pm
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-[#1a4a8d] mb-3">💬 WhatsApp</h3>
                <a href="https://wa.me/255756123456" className="text-[#00A8E8] hover:underline text-lg font-semibold">
                  Chat with us on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Regional Offices */}
      <Section className="bg-white">
        <h2 className="text-3xl font-bold text-[#1a4a8d] mb-8 text-center">Regional Offices</h2>
        <p className="text-center text-gray-700 mb-10 max-w-2xl mx-auto">
          Visit any of our regional offices across Tanzania. We're here to serve you with professional service and
          support.
        </p>
        <RegionCard />
      </Section>

      {/* FAQ */}
      <Section>
        <h2 className="text-3xl font-bold text-[#1a4a8d] mb-8 text-center">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              q: 'What documents do I need to rent a car?',
              a: 'You'll need a valid driver\'s license (at least 2 years old), a passport or national ID, and a credit card for the security deposit.',
            },
            {
              q: 'What is included in the rental price?',
              a: 'Our rental rates include full insurance coverage, roadside assistance, and a full tank of fuel.',
            },
            {
              q: 'Can I cancel or modify my booking?',
              a: 'Yes, you can cancel or modify your booking up to 24 hours before your scheduled pickup time with no penalty.',
            },
            {
              q: 'Do you offer delivery services?',
              a: 'Yes, we offer vehicle delivery to your location for a small additional fee. Contact our office for details.',
            },
          ].map((faq, idx) => (
            <details key={idx} className="group border border-gray-300 rounded-lg">
              <summary className="flex cursor-pointer items-center justify-between gap-4 p-6 font-semibold text-[#1a4a8d] hover:bg-gray-50">
                {faq.q}
                <span className="transition group-open:rotate-180">
                  <svg
                    fill="none"
                    height="20"
                    shapeRendering="geometricPrecision"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    width="20"
                  >
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </span>
              </summary>
              <p className="p-6 pt-0 text-gray-700">{faq.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
