import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, BedDouble, Bath, Square, Heart, 
  ArrowLeft, ArrowRight, Home, Building2, Building,
  TreePine, X, Map, Percent, Filter, Users, Eye,
  Clock, Shield, TrendingUp, SlidersHorizontal
} from 'lucide-react';
import { properties as propertyData } from '../data/properties.data';
import SearchInterface from '../components/search/SearchInterface';
import PropertyCard from '../components/cards/PropertyCard';
import { toast } from 'react-hot-toast';

const Properties = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [allProperties, setAllProperties] = useState(propertyData);
  const [filteredProperties, setFilteredProperties] = useState(propertyData);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesPerPage] = useState(12);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewCount, setViewCount] = useState(0);
  const [activeViewers, setActiveViewers] = useState(0);
  const [filters, setFilters] = useState({
    propertyType: [],
    priceRange: { min: '', max: '' },
    bedrooms: '',
    bathrooms: '',
    amenities: []
  });

  const categories = [
    { id: 'all', label: 'All', icon: Building },
    { id: 'homes', label: 'Homes', icon: Home },
    { id: 'apts', label: 'Apts', icon: Building2 },
    { id: 'land', label: 'Land', icon: Map },
  ];

  // Simulate real-time data
  useEffect(() => {
    setViewCount(Math.floor(Math.random() * 500) + 1000);
    setActiveViewers(Math.floor(Math.random() * 20) + 30);
  }, []);

  // Filter properties
  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    const filtered = allProperties.filter(property => {
      if (newFilters.propertyType.length && !newFilters.propertyType.includes(property.type)) {
        return false;
      }
      if (newFilters.priceRange.min && property.price < newFilters.priceRange.min) {
        return false;
      }
      if (newFilters.priceRange.max && property.price > newFilters.priceRange.max) {
        return false;
      }
      if (newFilters.bedrooms && property.bedrooms < newFilters.bedrooms) {
        return false;
      }
      if (newFilters.bathrooms && property.bathrooms < newFilters.bathrooms) {
        return false;
      }
      if (newFilters.amenities.length && !newFilters.amenities.every(a => property.amenities.includes(a))) {
        return false;
      }
      return true;
    });
    setFilteredProperties(filtered);
    setCurrentPage(1);
  };

  // Sort properties
  const handleSort = (sortType) => {
    setSortBy(sortType);
    const sorted = [...filteredProperties].sort((a, b) => {
      switch (sortType) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return new Date(b.dateAdded) - new Date(a.dateAdded);
        default:
          return 0;
      }
    });
    setFilteredProperties(sorted);
  };

  // Pagination
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  return (
    <div className="min-h-screen bg-white/50 pt-20">
      {/* Social Proof Banner */}
      <div className="bg-blue-600 text-white py-3">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{viewCount.toLocaleString()} people browsing</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{activeViewers} active viewers</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>100% Verified Listings</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <SearchInterface onSearch={handleFilter} />
          
          {/* Quick Filters */}
          <div className="mt-4 flex items-center gap-4">
            
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleFilter({ ...filters, propertyType: [category.id] })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  filters.propertyType.includes(category.id)
                    ? 'bg-blue-600 text-white'
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <category.icon className="h-4 w-4" />
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {filteredProperties.length} Properties Available
            </h1>
            <p className="text-gray-600">
              Find your perfect property from our curated listings
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="bg-white border rounded-lg px-4 py-2"
            >
              <option value="relevance">Most Relevant</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
            
            <button
              onClick={() => navigate('/map')}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50"
            >
              <Map className="h-4 w-4" />
              <span>Map View</span>
            </button>
          </div>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-white disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-white disabled:opacity-50"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Filter Drawer */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsFilterDrawerOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <button onClick={() => setIsFilterDrawerOpen(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Filter Form */}
              <form className="space-y-6">
                {/* Add your filter form fields here */}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Properties;