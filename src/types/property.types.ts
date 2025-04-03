export interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  type: 'Apartment' | 'Villa' | 'Flat' | 'Commercial' | 'luxury' | 'residential';
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  amenities: string[];
  description: string;
  status: 'Available' | 'Sold' | 'Pending';
  images?: string[];
  image?: string;
  coordinates?: [number, number];
} 