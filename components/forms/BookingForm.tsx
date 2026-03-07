'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { regions } from '@/data/regions';
import { Loader2 } from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  category: string;
  is_booked: boolean;
}

interface BookingFormData {
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  returnLocation: string;
  vehicleId: string;
  vehicleName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  driverLicense: string;
  notes: string;
}

export function BookingForm() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [formData, setFormData] = useState<BookingFormData>({
    pickupDate: '',
    returnDate: '',
    pickupLocation: '',
    returnLocation: '',
    vehicleId: '',
    vehicleName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    driverLicense: '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('vehicles')
      .select('id, name, category, is_booked')
      .eq('is_booked', false)
      .order('name');
    setVehicles(data || []);
    setLoadingVehicles(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'vehicleId') {
      const vehicle = vehicles.find(v => v.id === value);
      setFormData((prev) => ({
        ...prev,
        vehicleId: value,
        vehicleName: vehicle?.name || '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const supabase = createClient();

    const { error: insertError } = await supabase.from('bookings').insert({
      vehicle_id: formData.vehicleId || null,
      vehicle_name: formData.vehicleName,
      pickup_date: formData.pickupDate,
      return_date: formData.returnDate,
      pickup_location: formData.pickupLocation,
      return_location: formData.returnLocation,
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      driver_license: formData.driverLicense,
      notes: formData.notes,
      status: 'pending',
    });

    if (insertError) {
      setError('Failed to submit booking. Please try again.');
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-green-600 mb-2">Booking Request Submitted!</h3>
        <p className="text-gray-700 mb-4">
          Thank you for your booking request. We will contact you shortly to confirm your reservation.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({
              pickupDate: '',
              returnDate: '',
              pickupLocation: '',
              returnLocation: '',
              vehicleId: '',
              vehicleName: '',
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              driverLicense: '',
              notes: '',
            });
            fetchVehicles();
          }}
          className="px-6 py-2 bg-[#00A8E8] text-white font-semibold rounded-lg hover:bg-[#0087b8] transition-colors"
        >
          Make Another Booking
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Pickup Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Pickup Date</label>
          <input
            type="date"
            name="pickupDate"
            value={formData.pickupDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
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
            min={formData.pickupDate || new Date().toISOString().split('T')[0]}
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle</label>
          {loadingVehicles ? (
            <div className="flex items-center gap-2 text-gray-500 py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading available vehicles...
            </div>
          ) : (
            <select
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00A8E8]"
            >
              <option value="">Select vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.name} ({vehicle.category})
                </option>
              ))}
            </select>
          )}
          {vehicles.length === 0 && !loadingVehicles && (
            <p className="text-sm text-orange-600 mt-1">No vehicles currently available. Please contact us directly.</p>
          )}
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
              placeholder="+268"
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

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00A8E8] resize-none"
              placeholder="Any special requests or requirements..."
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting || vehicles.length === 0}
        className="w-full py-3 px-6 bg-[#00A8E8] text-white font-bold rounded-lg hover:bg-[#0087b8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          'Complete Booking'
        )}
      </button>
    </form>
  );
}
