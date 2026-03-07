import Link from 'next/link';
import { vehicles } from '@/data/vehicles';
import { Card } from '@/components/ui/Card';

export function VehicleGrid({ limit }: { limit?: number }) {
  const displayVehicles = limit ? vehicles.slice(0, limit) : vehicles;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayVehicles.map((vehicle) => (
        <Card key={vehicle.id} hover>
          {/* Vehicle Image Placeholder */}
          <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-gray-500 text-4xl">🚗</span>
          </div>

          {/* Vehicle Info */}
          <h3 className="text-xl font-bold text-[#1a4a8d] mb-2">{vehicle.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{vehicle.category}</p>
          <p className="text-gray-700 text-sm mb-4">{vehicle.description}</p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="text-sm">
              <span className="text-gray-600">Seats:</span>
              <span className="font-semibold ml-1">{vehicle.seats}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Trans:</span>
              <span className="font-semibold ml-1 capitalize">{vehicle.transmission}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Fuel:</span>
              <span className="font-semibold ml-1 capitalize">{vehicle.fuelType}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Daily:</span>
              <span className="font-semibold ml-1">${vehicle.dailyRate}</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <p className="text-gray-600">Daily</p>
                <p className="font-bold text-[#00A8E8]">${vehicle.dailyRate}</p>
              </div>
              <div>
                <p className="text-gray-600">Weekly</p>
                <p className="font-bold text-[#00A8E8]">${vehicle.weeklyRate}</p>
              </div>
              <div>
                <p className="text-gray-600">Monthly</p>
                <p className="font-bold text-[#00A8E8]">${vehicle.monthlyRate}</p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href="/booking"
            className="block w-full py-2 px-4 bg-[#00A8E8] text-white rounded-lg hover:bg-[#0087b8] transition-colors text-center font-semibold"
          >
            Book Now
          </Link>
        </Card>
      ))}
    </div>
  );
}
