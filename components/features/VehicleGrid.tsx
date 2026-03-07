'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/Card';
import { Loader2 } from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  category: string;
  image: string;
  seats: number;
  transmission: string;
  fuel_type: string;
  features: string[];
  description: string;
  is_booked: boolean;
  price_per_day: number;
}

export function VehicleGrid({ limit }: { limit?: number }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    const supabase = createClient();
    let query = supabase.from('vehicles').select('*').order('name');
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data } = await query;
    setVehicles(data || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a4a8d]" />
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No vehicles available at the moment. Please check back later.
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <Card key={vehicle.id} hover>
          {/* Vehicle Image */}
          <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={vehicle.image}
              alt={vehicle.name}
              fill
              className="object-cover"
            />
            {/* Availability Badge */}
            <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-white text-sm font-bold ${
              vehicle.is_booked ? 'bg-red-500' : 'bg-green-500'
            }`}>
              {vehicle.is_booked ? 'BOOKED' : 'AVAILABLE'}
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold text-[#1a4a8d]">{vehicle.name}</h3>
              <p className="text-sm text-gray-600 font-semibold capitalize">{vehicle.category}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-[#00A8E8]">E{vehicle.price_per_day}</p>
              <p className="text-xs text-gray-500">per day</p>
            </div>
          </div>
          
          {vehicle.description && (
            <p className="text-gray-700 text-sm mb-4">{vehicle.description}</p>
          )}

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b">
            <div className="text-sm">
              <span className="text-gray-600 block text-xs uppercase tracking-wide">Seats</span>
              <span className="font-semibold text-[#1a4a8d]">{vehicle.seats}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600 block text-xs uppercase tracking-wide">Transmission</span>
              <span className="font-semibold text-[#1a4a8d] capitalize">{vehicle.transmission}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600 block text-xs uppercase tracking-wide">Fuel Type</span>
              <span className="font-semibold text-[#1a4a8d] capitalize">{vehicle.fuel_type}</span>
            </div>
          </div>

          {/* Features List */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div className="mb-4">
              <p className="text-xs uppercase text-gray-600 font-semibold mb-2">Features</p>
              <div className="flex flex-wrap gap-2">
                {vehicle.features.map((feature, idx) => (
                  <span key={idx} className="text-xs bg-blue-50 text-[#1a4a8d] px-2 py-1 rounded">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA Button */}
          <Link
            href={vehicle.is_booked ? '/contact' : '/booking'}
            className={`block w-full py-2 px-4 rounded-lg transition-colors text-center font-semibold ${
              vehicle.is_booked 
                ? 'bg-gray-300 text-gray-700 cursor-not-allowed' 
                : 'bg-[#00A8E8] text-white hover:bg-[#0087b8]'
            }`}
          >
            {vehicle.is_booked ? 'Contact for Availability' : 'Book Now'}
          </Link>
        </Card>
      ))}
    </div>
  );
}
