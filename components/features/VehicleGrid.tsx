import Image from 'next/image';
import Link from 'next/link';
import { vehicles } from '@/data/vehicles';
import { Card } from '@/components/ui/Card';

export function VehicleGrid({ limit }: { limit?: number }) {
  const displayVehicles = limit ? vehicles.slice(0, limit) : vehicles;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayVehicles.map((vehicle) => (
        <Card key={vehicle.id} hover>
          {/* Vehicle Image */}
          <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={vehicle.image}
              alt={vehicle.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
            {/* Availability Badge */}
            <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-white text-sm font-bold ${
              vehicle.isBooked ? 'bg-red-500' : 'bg-green-500'
            }`}>
              {vehicle.isBooked ? 'BOOKED' : 'AVAILABLE'}
            </div>
          </div>

          {/* Vehicle Info */}
          <h3 className="text-xl font-bold text-[#1a4a8d] mb-2">{vehicle.name}</h3>
          <p className="text-sm text-gray-600 mb-3 font-semibold">{vehicle.category}</p>
          <p className="text-gray-700 text-sm mb-4">{vehicle.description}</p>

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
              <span className="font-semibold text-[#1a4a8d] capitalize">{vehicle.fuelType}</span>
            </div>
          </div>

          {/* Features List */}
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

          {/* CTA Button */}
          <Link
            href={vehicle.isBooked ? '/contact' : '/booking'}
            className={`block w-full py-2 px-4 rounded-lg transition-colors text-center font-semibold ${
              vehicle.isBooked 
                ? 'bg-gray-300 text-gray-700 cursor-not-allowed' 
                : 'bg-[#00A8E8] text-white hover:bg-[#0087b8]'
            }`}
          >
            {vehicle.isBooked ? 'Contact for Availability' : 'Book Now'}
          </Link>
        </Card>
      ))}
    </div>
  );
}
