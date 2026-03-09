import { Section } from '@/components/ui/Section';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Fenix Car Hire',
  description: 'Read our terms and conditions for car rental services.',
};

export default function Terms() {
  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-r from-[#1a4a8d] to-[#00A8E8] text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
        <p className="text-xl text-gray-100">
          Please read our terms and conditions carefully before booking with Fenix Car Hire.
        </p>
      </Section>

      {/* Terms Content */}
      <Section>
        <div className="max-w-4xl mx-auto prose prose-lg">
          <div className="space-y-8 text-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-[#1a4a8d] mb-4">1. Rental Agreement</h2>
              <p>
                By booking a vehicle with Fenix Car Hire, you agree to these terms and conditions. The rental agreement
                becomes binding upon payment and vehicle delivery.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1a4a8d] mb-4">2. Requirements</h2>
              <p>To rent a vehicle, you must:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Be at least 21 years old</li>
                <li>Possess a valid driver's license with at least 2 years experience</li>
                <li>Present a valid passport or national ID</li>
                <li>Provide a valid credit card for security deposit</li>
                <li>Have valid insurance documentation</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1a4a8d] mb-4">3. Rental Charges</h2>
              <p>
                Rental charges are calculated based on the vehicle category, rental period, and any additional services
                selected. Prices quoted include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Comprehensive insurance coverage</li>
                <li>Full tank of fuel</li>
                <li>24/7 roadside assistance</li>
                <li>GPS navigation system</li>
                <li>Basic maintenance and repairs</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1a4a8d] mb-4">4. Payment Terms</h2>
              <p>
                Payment is required at the time of booking. We accept credit cards, debit cards, mobile money transfers,
                and bank transfers. A security deposit equal to the total rental cost is required and will be refunded
                after vehicle return in good condition.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1a4a8d] mb-4">5. Vehicle Condition</h2>
              <p>
                The renter agrees to inspect the vehicle before departure and report any damage or concerns. The vehicle
                must be returned in the same condition as rented. Charges will apply for any damage beyond normal wear
                and tear.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1a4a8d] mb-4">6. Mileage</h2>
              <p>
                Daily rentals include 100 kilometers. Weekly rentals include 500 kilometers. Monthly rentals include
                unlimited kilometers. Excess mileage is charged at E5 per kilometer.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1a4a8d] mb-4">7. Fuel Policy</h2>
              <p>
                All vehicles are rented with a full tank of fuel. The vehicle must be returned with a full tank. If
                returned with less fuel, a refueling charge plus E50 administration fee will be applied.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1a4a8d] mb-4">8. Late Return</h2>
              <p>
                If the vehicle is not returned by the agreed time, a late fee of E100 per hour (or E500
                per day) will be charged, plus any additional fuel and mileage charges.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1a4a8d] mb-4">9. Cancellation & Refunds</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Free cancellation up to 24 hours before pickup</li>
                <li>50% refund for cancellations 12-24 hours before pickup</li>
                <li>No refund for cancellations less than 6 hours before pickup</li>
                <li>Modifications to bookings are always free</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1a4a8d] mb-4">10. Driver Responsibility</h2>
              <p>The renter is responsible for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Operating the vehicle in compliance with all traffic laws</li>
                <li>Maintaining the vehicle in safe and roadworthy condition</li>
                <li>Reporting any accidents or damage immediately</li>
                <li>Not transferring the vehicle to any third party</li>
                <li>Keeping the vehicle secure and protected from theft</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1a4a8d] mb-4">11. Insurance & Liability</h2>
              <p>
                All rental vehicles are covered by comprehensive insurance. The renter is responsible for the deductible
                amount in case of accident or damage. Additional insurance options are available at booking.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1a4a8d] mb-4">12. Prohibited Use</h2>
              <p>The vehicle may not be used for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Commercial purposes (without authorization)</li>
                <li>Towing or carrying heavy loads beyond capacity</li>
                <li>Off-road driving or racing</li>
                <li>Transporting illegal goods</li>
                <li>Vehicle modification or repairs</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1a4a8d] mb-4">13. Limitation of Liability</h2>
              <p>
                Fenix Car Hire is not liable for personal injury, loss of property, or consequential damages resulting
                from vehicle rental, use, or accident, except as covered by insurance.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1a4a8d] mb-4">14. Contact & Support</h2>
              <p>
                For questions or issues regarding these terms and conditions, please contact us at:
                <br />
                Phone: +268 24221045
                <br />
                Email: reception@fenix.co.sz
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-[#00A8E8] p-4 mt-8">
              <p className="text-sm text-gray-700">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
                <br />
                These terms and conditions are subject to change without notice. Please review regularly for updates.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
