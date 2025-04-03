// Properties data with consistent format
const properties = [
  {
    id: 1,
    owner_id: "owner1",
    title: "Luxury Villa in Asokoro",
    price: "120000000",
    location: "Asokoro District, Abuja",
    bedrooms: 5,
    bathrooms: 4,
    area: "300",
    image: "/images/properties/prop1/1.jpg",
    images: [
      "/images/properties/prop1/1.jpg",
      "/images/properties/prop2/2.jpg",
      "/images/properties/prop3/3.jpg",
      "/images/properties/prop4/4.jpg"
    ],
    description: "Elegant villa with premium finishes in prestigious Asokoro.",
    coordinates: [7.526, 9.045],
    type: "Luxury",
    amenities: ["Swimming Pool", "24/7 Security", "Garden", "Garage"],
    status: "Available",
    date_available: "2025-02-06",
    verified: true
  },
  {
    id: 2,
    owner_id: "owner1",
    title: "Modern 3 Bedroom Apartment",
    location: "Gombe",
    price: "5000000",
    type: "Apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: "180",
    image: "/images/properties/prop2/1.jpg",
    images: [
      "/images/properties/prop2/1.jpg",
      "/images/properties/prop2/2.jpg",
      "/images/properties/prop2/3.jpg"
    ],
    amenities: ["Swimming Pool", "24/7 Security", "Parking Space"],
    description: "Beautiful modern apartment in a serene environment",
    status: "Available",
    coordinates: [10.287, 11.169],
    verified: false
  },
  {
    id: 3, 
    owner_id: 'owner1',
    title: "Luxury Villa with Garden",
    location: "Gombe GRA",
    price: "12000000",
    type: "Villa",
    bedrooms: 5,
    bathrooms: 4,
    amenities: ["Garden", "Security", "Garage", "Swimming Pool"],
    description: "Spacious luxury villa with beautiful garden",
    status: "Available",
    image: "/images/image3.jpg",
    images: ["/images/image3.jpg"],
      coordinates: [10.290, 11.172],
      verified: false
  },  
  {
    id: 4,
    owner_id: 'owner1',
    title: "Office Space in Central Business District",
    price: "45000000",
    location: "CBD, Abuja",
    bedrooms: null,
    bathrooms: 2,
    area: "200",
    image: "/images/image3.jpg",
    images: ["/images/image3.jpg"],
    description: "Prime office space in Abuja's business hub.",
    coordinates: [7.498, 9.027],
    type: "Commercial",
    amenities: ["24/7 Power", "Parking Lot", "Security"],
    status: "Available",
    verified: true
  },  
  {
      id: 5,
    owner_id: 'owner1',
    title: "Student Apartment",
    location: "Near Gombe University",
    price: "2000000",
    type: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
    area: "80",
    image: "/images/image1.jpg",
    images: ["/images/image1.jpg"],
    amenities: ["Internet", "Security", "Study Area"],
    description: "Perfect for students, close to university",
    status: "Available",
      coordinates: [10.285, 11.165],
      verified: false
  },  
  {  
    id: 6,
    owner_id: 'owner1',
    title: "Garden Apartment in Wuse",
    price: "65000000",
    location: "Wuse Zone 6, Abuja",
    bedrooms: 2,
    bathrooms: 2,
    area: "120",
    image: "/images/image2.jpg",
    images: ["/images/image2.jpg"],
    description: "Modern apartment with beautiful garden views.",
    coordinates: [7.459, 9.072],
    type: "Commercial",
    amenities: ["Garden", "Security", "Parking"],
    status: "Available",
    verified: false
  },
{
    id: 7,
    owner_id: "owner2",
    title: "Duplex with pool in Maitama",
    price: "300000000",
    location: "Maitama District, Abuja",
    bedrooms: 6,
    bathrooms: 5,
    area: "450",
    image: "/images/properties/prop1/3.jpg",
    images: [
      "/images/properties/prop1/3.jpg",
      "/images/properties/prop2/2.jpg",
    ],
    description: "Spacious duplex in prestigious Maitama with private swimming pool.",
    coordinates: [7.525, 9.048],
    type: "Luxury",
    amenities: ["Swimming Pool", "24/7 Security", "Garden", "Garage", "Gym"],
    status: "Available",
    date_available: "2024-09-15",
    verified: true
  },
];

//Helper functions
const getPropertyById = (id) => properties.find(p => p.id === id);

const filterProperties = (filters = {}) => {
  return properties.filter(property => {
    let matches = true;
    if (filters.location) {
      matches = matches && property.location.toLowerCase().includes(filters.location.toLowerCase());
    }
    if (filters.maxPrice) {
      matches = matches && parseInt(property.price) <= filters.maxPrice;
    }
    if (filters.type && filters.type !== 'all') {
      matches = matches && property.type === filters.type;
    }
    if (filters.bedrooms) {
      matches = matches && property.bedrooms >= filters.bedrooms;
    }
    if (filters.amenities?.length) {
      matches = matches && filters.amenities.every(amenity => 
      property.amenities.includes(amenity)
      );
    }
    return matches;
  });
};

const getPropertiesByType = (type) =>
  type === "all"
    ? properties
    : properties.filter((p) => p.type === type);

const getPropertiesByPriceRange = (min, max) => properties.filter(p => parseInt(p.price) >= min && parseInt(p.price) <= max);
const getPropertiesByLocation = (location) => properties.filter(p => p.location.toLowerCase().includes(location.toLowerCase()));


module.exports = {
  properties,
  getPropertyById,
  filterProperties,
  getPropertiesByType, getPropertiesByPriceRange, getPropertiesByLocation
};