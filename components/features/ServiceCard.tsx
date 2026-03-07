import { services } from '@/data/services';
import { Card } from '@/components/ui/Card';

export function ServiceCard() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <Card key={service.id} hover>
          <div className="text-5xl mb-4">{service.icon}</div>
          <h3 className="text-xl font-bold text-[#1a4a8d] mb-2">{service.title}</h3>
          <p className="text-gray-700 mb-4">{service.description}</p>
          <ul className="space-y-2">
            {service.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 bg-[#00A8E8] rounded-full"></span>
                {feature}
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}
