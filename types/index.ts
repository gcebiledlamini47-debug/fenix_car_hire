// Vehicle types for the fleet
export interface Vehicle {
  id: string;
  name: string;
  category: string;
  image: string;
  seats: number;
  transmission: 'manual' | 'automatic';
  fuelType: 'petrol' | 'diesel' | 'hybrid';
  features: string[];
  description: string;
  isBooked: boolean;
}

// Service types
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

// Regional service availability
export interface Region {
  id: string;
  name: string;
  cities: string[];
  phone: string;
  email: string;
  address: string;
}

// Navigation link type
export interface NavLink {
  label: string;
  href: string;
  id: string;
}

// Booking form data
export interface BookingData {
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

// Contact form data
export interface ContactData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}
