import { HeroSlider } from '@/components/features/HeroSlider';
import { VehicleGrid } from '@/components/features/VehicleGrid';
import { ServiceCard } from '@/components/features/ServiceCard';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <>
      {/* Hero Slider */}
      <Section className="bg-white">
        <HeroSlider />
      </Section>

      {/* Quick Intro */}
      <Section className="bg-gradient-to-r from-[#1a4a8d] to-[#00A8E8] text-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Welcome to Fenix Car Hire Eswatini</h2>
          <p className="text-lg max-w-3xl mx-auto text-gray-100">
            For all your rental needs - Quality vehicles, professional service, and 24/7 support throughout Eswatini.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-5xl mb-3">🚗</div>
            <h3 className="text-xl font-bold mb-2">Wide Selection</h3>
            <p>From economy cars to luxury vehicles, we have the perfect option for you.</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-3">✓</div>
            <h3 className="text-xl font-bold mb-2">Reliable Service</h3>
            <p>Well-maintained vehicles with transparent terms and no hidden charges.</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-3">🛡️</div>
            <h3 className="text-xl font-bold mb-2">Full Safety</h3>
            <p>Complete insurance coverage and 24/7 customer support.</p>
          </div>
        </div>
      </Section>

      {/* Featured Vehicles */}
      <Section>
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a4a8d] mb-4">Featured Vehicles</h2>
          <p className="text-gray-700 text-lg">Explore our premium selection of well-maintained vehicles</p>
        </div>
        <VehicleGrid limit={3} />
        <div className="text-center mt-10">
          <Button href="/fleet" isLink variant="secondary">
            View Full Fleet
          </Button>
        </div>
      </Section>

      {/* Services */}
      <Section className="bg-white">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a4a8d] mb-4">Our Services</h2>
          <p className="text-gray-700 text-lg">Comprehensive solutions for all your car rental needs</p>
        </div>
        <ServiceCard />
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-r from-[#00A8E8] to-[#0087b8] text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Book?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Don't wait! Reserve your vehicle today and enjoy reliable, professional car rental service.
        </p>
        <Button href="/booking" isLink variant="outline">
          Book Your Car Now
        </Button>
      </Section>
    </>
  );
}
