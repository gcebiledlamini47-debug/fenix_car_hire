import { regions } from '@/data/regions';
import { Card } from '@/components/ui/Card';

export function RegionCard() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {regions.map((region) => (
        <Card key={region.id} hover>
          <h3 className="text-2xl font-bold text-[#1a4a8d] mb-3">{region.name}</h3>

          {/* Cities */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 mb-2">Locations</h4>
            <div className="flex flex-wrap gap-2">
              {region.cities.map((city, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {city}
                </span>
              ))}
            </div>
          </div>

          {/* Address */}
          <div className="mb-3 pb-3 border-b border-gray-200">
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Address:</span>
            </p>
            <p className="text-gray-700">{region.address}</p>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-semibold text-gray-700">Phone:</span>
              <a href={`tel:${region.phone}`} className="text-[#00A8E8] hover:underline ml-1">
                {region.phone}
              </a>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-gray-700">Email:</span>
              <a href={`mailto:${region.email}`} className="text-[#00A8E8] hover:underline ml-1">
                {region.email}
              </a>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
