'use client';

import { useState } from 'react';
import { vehicles } from '@/data/vehicles';
import { regions } from '@/data/regions';

interface BookingFormData {
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  returnLocation: string;
  vehicleType: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  driverLicense: string;
}

export function BookingForm() {
  const [formData, setFormData] = useState<BookingFormData>({
    pickupDate: '',
    returnDate: '',
    pickupLocation: '',
    returnLocation: '',
    vehicleType: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    driverLicense: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to submit booking');

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          pickupDate: '',
          returnDate: '',
          pickupLocation: '',
          returnLocation: '',
          vehicleType: '',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          driverLicense: '',
        });
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-green-600 mb-2">Booking Request Submitted!</h3>
        <p className="text-gray-700">
          Thank you for your booking request. We will contact you shortly to confirm your reservation.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-500 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-red-600 mb-2">Error</h3>
        <p className="text-gray-700">{error}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Pickup Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Pickup Date</label>
          <input
            type="date"
            name="pickupDate"
            value={formData.pickupDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00A8E8]"
          />
        </div>

        {/* Return Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Return Date</label>
          <input
            type="date"
            name="returnDate"
            value={formData.returnDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00A8E8]"
          />
        </div>

        {/* Pickup Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Pickup Location</label>
          <select
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00A8E8]"
          >
            <option value="">Select location</option>
            {regions.map((region) => (
              <option key={region.id} value={region.name}>
                {region.name}
              </option>
            ))}
          </select>
        </div>

        {/* Return Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Return Location</label>
          <select
            name="returnLocation"
            value={formData.returnLocation}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00A8E8]"
          >
            <option value="">Select location</option>
            {regions.map((region) => (
              <option key={region.id} value={region.name}>
                {region.name}
              </option>
            ))}
          </select>
        </div>

        {/* Vehicle Type */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Type</label>
          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00A8E8]"
          >
            <option value="">Select vehicle</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.name}>
                {vehicle.name} ({vehicle.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Driver Info */}
      <div className="border-t pt-6 mb-6">
        <h3 className="text-lg font-bold text-[#1a4a8d] mb-4">Driver Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00A8E8]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00A8E8]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00A8E8]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00A8E8]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Driver License Number</label>
            <input
              type="text"
              name="driverLicense"
              value={formData.driverLicense}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00A8E8]"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 bg-[#00A8E8] text-white font-bold rounded-lg hover:bg-[#0087b8] transition-colors disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
