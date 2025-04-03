import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search,
  MapPin, 
  BedDouble, 
  Bath, 
  Square, 
  Heart, 
  ArrowLeft, 
  ArrowRight, 
  Home,
  Building2,
  Building,
  Store,
  Castle,
  Warehouse,
  Hotel,
  TreePine, 
  X, 
  Map,
  Percent,
  Maximize2,
  MinusCircle
} from 'lucide-react';
import { properties as propertyData } from '../data/properties.data';
import SearchInterface from '../components/SearchInterface';
import PropertyCard from '../components/PropertyCard';

const Properties = ({ handleSaveChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [allProperties, setAllProperties] = useState(propertyData);
  const [filteredProperties, setFilteredProperties] = useState(propertyData);
  const [activeView, setActiveView] = useState('properties');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesPerPage] = useState(12);
  const [sortBy, setSortBy] = useState('relevance');
  const [compareList, setCompareList] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [filters, setFilters] = useState({
    propertyType: [],
    priceRange: { min: '', max: '' },
    bedrooms: '',
    bathrooms: '',
    amenities: [],
    furnished: false,
    availability: '',
    propertyAge: '',
    parkingSpots: '',
    floorLevel: '',
    facing: '',
    petsAllowed: false,
    securityFeatures: [],
    nearbyFacilities: [],
    distanceTo: {
      schools: '',
      hospitals: '',
      shopping: '',
      transport: ''
    }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showMapView, setShowMapView] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const categories = [
    { id: 'all', label: 'All', icon: Home },
    { id: 'residential', label: 'Homes', icon: Building2 },
    { id: 'apartments', label: 'Apts', icon: Building },
    { id: 'commercial', label: 'Office', icon: Store },
    { id: 'luxury', label: 'Luxury', icon: Castle },
    { id: 'industrial', label: 'Industrial', icon: Warehouse },
    { id: 'hotels', label: 'Hotels', icon: Hotel },
    { id: 'land', label: 'Land', icon: TreePine }
  ];

  const openModal = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
    document.body.style.overflow = 'unset';
  };

  const handleViewProperty = (propertyId) => {
    closeModal();
    navigate(`/property/${propertyId}`);
  };

  // Filter properties based on filters
  const filterProperties = (properties, filters) => {
    return properties.filter(property => {
      // Property Type
      if (filters.propertyType.length > 0 && !filters.propertyType.includes(property.type)) {
        return false;
      }

      // Price Range
      if (filters.priceRange.min && property.price < parseInt(filters.priceRange.min)) {
        return false;
      }
      if (filters.priceRange.max && property.price > parseInt(filters.priceRange.max)) {
        return false;
      }

      // Bedrooms
      if (filters.bedrooms && filters.bedrooms !== 'Any' && property.bedrooms !== parseInt(filters.bedrooms)) {
        if (filters.bedrooms === '4+' && property.bedrooms < 4) return false;
        if (filters.bedrooms !== '4+' && property.bedrooms !== parseInt(filters.bedrooms)) return false;
      }

      // Bathrooms
      if (filters.bathrooms && filters.bathrooms !== 'Any' && property.bathrooms !== parseInt(filters.bathrooms)) {
        if (filters.bathrooms === '4+' && property.bathrooms < 4) return false;
        if (filters.bathrooms !== '4+' && property.bathrooms !== parseInt(filters.bathrooms)) return false;
      }

      // Amenities
      if (filters.amenities.length > 0 && !filters.amenities.every(amenity => property.amenities.includes(amenity))) {
        return false;
      }

      // Furnished
      if (filters.furnished && !property.furnished) {
        return false;
      }

      // Property Age
      if (filters.propertyAge) {
        const age = parseInt(property.yearBuilt);
        if (filters.propertyAge === '0-1' && (age < (new Date().getFullYear() - 1) || age > new Date().getFullYear())) return false;
        if (filters.propertyAge === '1-5' && (age < (new Date().getFullYear() - 5) || age > (new Date().getFullYear() - 1))) return false;
        if (filters.propertyAge === '5-10' && (age < (new Date().getFullYear() - 10) || age > (new Date().getFullYear() - 5))) return false;
        if (filters.propertyAge === '10+' && age > (new Date().getFullYear() - 10)) return false;
      }

      // Floor Level
      if (filters.floorLevel) {
        if (filters.floorLevel === 'ground' && property.floorLevel !== 'ground') return false;
        if (filters.floorLevel === '1-3' && (property.floorLevel < 1 || property.floorLevel > 3)) return false;
        if (filters.floorLevel === '4-10' && (property.floorLevel < 4 || property.floorLevel > 10)) return false;
        if (filters.floorLevel === '10+' && property.floorLevel < 10) return false;
      }

      // Pets Allowed
      if (filters.petsAllowed && !property.petsAllowed) {
        return false;
      }

      // Distance to Facilities
      if (filters.distanceTo) {
        if (filters.distanceTo.schools && property.distanceTo.schools > parseInt(filters.distanceTo.schools.split('-')[1] || filters.distanceTo.schools.split('< ')[1] || 1000)) return false;
        if (filters.distanceTo.hospitals && property.distanceTo.hospitals > parseInt(filters.distanceTo.hospitals.split('-')[1] || filters.distanceTo.hospitals.split('< ')[1] || 1000)) return false;
        if (filters.distanceTo.shopping && property.distanceTo.shopping > parseInt(filters.distanceTo.shopping.split('-')[1] || filters.distanceTo.shopping.split('< ')[1] || 1000)) return false;
        if (filters.distanceTo.transport && property.distanceTo.transport > parseInt(filters.distanceTo.transport.split('-')[1] || filters.distanceTo.transport.split('< ')[1] || 1000)) return false;
      }

      return true;
    });
  };

  // Sort properties based on sortBy
  const sortProperties = (properties, sortBy) => {
    switch (sortBy) {
      case 'price-asc':
        return [...properties].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...properties].sort((a, b) => b.price - a.price);
      case 'newest':
        return [...properties].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
      case 'oldest':
        return [...properties].sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
      default:
        return properties;
    }
  };

  // Handle search and filter
  const handleSearch = (searchData) => {
    const filtered = filterProperties(allProperties, searchData.filters);
    const sorted = sortProperties(filtered, searchData.filters.sortBy);
    setFilteredProperties(sorted);
    setCurrentPage(1);
    setFilters(searchData.filters);
  };

  // Handle map view click
  const handleMapViewClick = () => {
    navigate('/map', { 
      state: { 
        properties: filteredProperties,
        filters: filters 
      } 
    });
  };

  // Pagination logic
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Enhanced handle compare function
  const handleCompare = (property, e) => {
    if (e) e.stopPropagation();
    
    console.log('Compare clicked', property);
    
    if (compareList.find(item => item.id === property.id)) {
      console.log('Removing from compare list');
      setCompareList(compareList.filter(item => item.id !== property.id));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare up to 3 properties at a time');
        return;
      }
      console.log('Adding to compare list');
      setCompareList([...compareList, property]);
    }
  };

  // Handle save property
  const handleSave = (property, e) => {
    if (e) e.stopPropagation(); // Prevent event bubbling
    
    if (savedProperties.find(item => item.id === property.id)) {
      setSavedProperties(savedProperties.filter(item => item.id !== property.id));
    } else {
      setSavedProperties([...savedProperties, property]);
    }
  };

  // Handle sort change
  const handleSortChange = (e) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    const sorted = sortProperties([...filteredProperties], newSortBy);
    setFilteredProperties(sorted);
  };

  useEffect(() => {
    setAllProperties(propertyData);
    setFilteredProperties(propertyData);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-20 relative">
      {/* Enhanced Fixed Search Header */}
      <div className="bg-white shadow-sm sticky top-20 z-10 border-b border-[#1c5bde]/10">
        <div className="container mx-auto">
          <SearchInterface 
            onSearch={handleSearch}
            initialFilters={filters}
            showTrending={false}
            categories={categories}
            activeCategory={activeView}
            onCategoryChange={setActiveView}
            enhancedView={true}
          />
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Count and Sort */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1 bg-gradient-to-r from-[#1c5bde] to-[#1c5bde]/80 bg-clip-text text-transparent">
              Available Properties
            </h1>
            <p className="text-sm text-neutral-600">
              Showing {filteredProperties.length} properties
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="px-4 py-2 rounded-xl border border-[#1c5bde]/20 text-sm text-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#1c5bde]/20"
            >
              <option value="relevance">Relevance</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Properties Grid with Enhanced Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProperties.map(property => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              onSaveChange={handleSaveChange}
            />
          ))}
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => paginate(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-full bg-white border border-[#1c5bde]/20 hover:bg-[#1c5bde]/5 
                       disabled:opacity-50 disabled:hover:bg-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-[#1c5bde]" />
            </motion.button>
            {Array.from({ length: totalPages }, (_, i) => (
              <motion.button
                key={i + 1}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => paginate(i + 1)}
                className={`w-10 h-10 rounded-full font-medium transition-colors ${
                  currentPage === i + 1
                    ? 'bg-[#1c5bde] text-white shadow-md shadow-[#1c5bde]/20'
                    : 'bg-white border border-[#1c5bde]/20 text-neutral-600 hover:bg-[#1c5bde]/5'
                }`}
              >
                {i + 1}
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => paginate(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full bg-white border border-[#1c5bde]/20 hover:bg-[#1c5bde]/5 
                       disabled:opacity-50 disabled:hover:bg-white transition-colors"
            >
              <ArrowRight className="h-5 w-5 text-[#1c5bde]" />
            </motion.button>
          </div>
        )}
      </div>

      {/* Enhanced Filter Drawer */}
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
              onClick={e => e.stopPropagation()}
              className="absolute right-0 top-0 h-full w-full max-w-md bg-white overflow-y-auto"
            >
              <div className="sticky top-0 bg-white p-4 border-b z-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Filters</h2>
                  <button
                    onClick={() => setIsFilterDrawerOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-6">
                {/* Price Range */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Price Range</h3>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="Min"
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Property Type */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Property Type</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['Residential', 'Commercial', 'Industrial', 'Land'].map((type) => (
                      <button
                        key={type}
                        className="px-4 py-2 border rounded-lg text-gray-600 hover:border-[#1c5bde] hover:text-[#1c5bde] transition-colors"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bedrooms */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Bedrooms</h3>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, '5+'].map((num) => (
                      <button
                        key={num}
                        className="flex-1 px-4 py-2 border rounded-lg text-gray-600 hover:border-[#1c5bde] hover:text-[#1c5bde] transition-colors"
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Amenities</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      'Parking', 'Pool', 'Gym', 'Security',
                      'Garden', 'Elevator', 'Furnished', 'Pet Friendly'
                    ].map((amenity) => (
                      <label
                        key={amenity}
                        className="flex items-center gap-2 text-gray-600"
                      >
                        <input type="checkbox" className="rounded text-[#1c5bde]" />
                        {amenity}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Apply Filters Button */}
              <div className="sticky bottom-0 bg-white p-4 border-t">
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="w-full bg-[#1c5bde] text-white py-3 rounded-lg hover:bg-[#0c0d8a] transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Modal with Mapbox */}
      <AnimatePresence>
        {isModalOpen && selectedProperty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Property Image Side with Navigation */}
                <div className="relative h-72 md:h-full">
                  <img
                    src={selectedProperty.image}
                    alt={selectedProperty.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Modal Image Navigation */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-colors"
                    >
                      <ArrowLeft className="h-5 w-5 text-gray-900" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-colors"
                    >
                      <ArrowRight className="h-5 w-5 text-gray-900" />
                    </motion.button>
                  </div>
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Property Details Side */}
                <div className="p-6 flex flex-col h-full">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{selectedProperty.title}</h2>
                    <p className="text-gray-600 mb-4">{selectedProperty.description}</p>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-5 w-5 text-[#1c5bde]" />
                        <span>{selectedProperty.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Square className="h-5 w-5 text-[#1c5bde]" />
                        <span>{selectedProperty.area}</span>
                      </div>
                    </div>

                    {/* Mapbox Static Map */}
                    <div className="rounded-lg h-[400px] relative overflow-hidden mb-4">
                      <img
                        src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+ff0000(${selectedProperty.coordinates[0]},${selectedProperty.coordinates[1]})/${selectedProperty.coordinates[0]},${selectedProperty.coordinates[1]},14,0,0/800x400@2x?access_token=pk.eyJ1IjoibW10dWt1ciIsImEiOiJjbTEyZGk2dmwwbjZyMmtzMXFzb3V0cHRuIn0.pDgNHWd_o6u2NKVFib0EPQ`}
                        alt={`Map showing ${selectedProperty.location}`}
                        className="absolute inset-0 w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Action Buttons - Centered on Mobile */}
                  <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3 mt-4">
                    <button
                      onClick={closeModal}
                      className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto"
                    >
                      Close
                    </button>
    
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Compare Button */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="fixed bottom-6 right-6 z-[60]"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCompareModal(true)}
              className="bg-[#1c5bde] text-white px-4 py-2.5 rounded-full shadow-lg 
                       hover:bg-[#1c5bde]/90 transition-all flex items-center gap-2"
            >
              <div className="relative">
                <Square className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 bg-white text-[#1c5bde] 
                               rounded-full text-xs w-4 h-4 flex items-center justify-center font-medium">
                  {compareList.length}
                </span>
              </div>
              <span className="text-sm font-medium">Compare</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare Modal */}
      <AnimatePresence>
        {showCompareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCompareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Compare Properties ({compareList.length}/3)
                </h3>
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Properties Grid */}
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {compareList.map((property) => (
                    <div
                      key={property.id}
                      className="group relative bg-gray-50 rounded-xl overflow-hidden"
                    >
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-40 object-cover"
                      />
                      <button
                        onClick={(e) => handleCompare(property, e)}
                        className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full 
                                 hover:bg-white transition-colors"
                      >
                        <MinusCircle className="h-4 w-4 text-red-500" />
                      </button>
                      <div className="p-3">
                        <h4 className="font-medium text-sm mb-1 truncate">{property.title}</h4>
                        <p className="text-sm text-gray-500 mb-2 truncate">{property.location}</p>
                        <p className="text-sm font-semibold text-[#1c5bde]">{property.price}</p>
                      </div>
                    </div>
                  ))}
                  {[...Array(3 - compareList.length)].map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="border-2 border-dashed border-gray-200 rounded-xl h-[200px] 
                               flex items-center justify-center p-4"
                    >
                      <p className="text-sm text-gray-400 text-center">
                        Add another property to compare
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => {
                      setCompareList([]);
                      setShowCompareModal(false);
                    }}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={() => {
                      navigate('/compare', { state: { properties: compareList } });
                    }}
                    className="bg-[#1c5bde] text-white px-4 py-2 rounded-lg text-sm font-medium 
                             hover:bg-[#1c5bde]/90 transition-colors flex items-center gap-2"
                    disabled={compareList.length < 2}
                  >
                    Compare Details
                    <Maximize2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Map Button */}
      <div className="fixed bottom-9 left-1/2 transform -translate-x-1/2 z-1">
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/map')}
          className="group bg-[#1c5bde] text-white px-4 py-2.5 rounded-full 
                     shadow-lg hover:shadow-xl hover:shadow-[#1c5bde]/20
                     transition-all duration-300 flex items-center gap-2"
        >
          <div className="relative">
            <Map className="h-4 w-4" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 
                         rounded-full border-2 border-white"
            />
          </div>
          <span className="font-medium text-sm">Map</span>
          <span className="text-xs opacity-75">({filteredProperties.length})</span>
          
          {/* Hover Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 pointer-events-none
                          opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-white text-[#1c5bde] text-sm px-3 py-1.5 rounded-lg shadow-lg
                            whitespace-nowrap">
              Explore properties on interactive map
            </div>
            <div className="w-2 h-2 bg-white transform rotate-45 absolute -bottom-1 
                          right-6"></div>
          </div>

          {/* Optional: Pulse Effect */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.3, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
            className="absolute inset-0 bg-[#1c5bde] rounded-full"
          />
        </motion.button>

      </div>
    </div>
  );
};

export default Properties;