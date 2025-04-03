import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check, Building2, Home, Building, Square, Car, Wifi, Shield, 
         UtensilsCrossed, Trees, Zap, Droplet, Bath, Bed, Ruler, Calendar,
         Compass, Dog, School, Hospital, ShoppingBag, Train, Map } from 'lucide-react';

const AdvancedFilters = ({ filters, setFilters, onClose }) => {
  const [activeTab, setActiveTab] = useState('basic');

  const propertyTypes = [
    { id: 'all', label: 'All', icon: Building },
    { id: 'homes', label: 'Homes', icon: Home },
    { id: 'apts', label: 'Apts', icon: Building2 },
    { id: 'land', label: 'Land', icon: Map }
  ];

  const amenities = [
    { icon: Wifi, label: 'Internet', category: 'utilities' },
    { icon: Car, label: 'Parking', category: 'facilities' },
    { icon: Shield, label: 'Security', category: 'safety' },
    { icon: UtensilsCrossed, label: 'Kitchen', category: 'indoor' },
    { icon: Trees, label: 'Garden', category: 'outdoor' },
    { icon: Zap, label: '24/7 Power', category: 'utilities' },
    { icon: Droplet, label: 'Water Supply', category: 'utilities' }
  ];

  const handleFilterChange = (category, value) => {
    setFilters(prev => {
      if (Array.isArray(prev[category])) {
        return {
          ...prev,
          [category]: prev[category].includes(value)
            ? prev[category].filter(item => item !== value)
            : [...prev[category], value]
        };
      }
      return {
        ...prev,
        [category]: value
      };
    });
  };

  const handlePropertyTypeChange = (type) => {
    setFilters(prev => ({ ...prev, propertyType: type }));
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[48]"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed left-0 right-0 top-20 -translate-y-0 w-[95%] sm:w-[85%] md:w-[75%] 
                 lg:max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 
                 overflow-hidden z-[49] max-h-[85vh] overflow-y-auto"
      >
        {/* Filter Header - Made sticky */}
        <div className="sticky top-0 bg-white border-b border-gray-100 z-20">
          <div className="flex items-center justify-between p-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
              <p className="text-sm text-gray-500">Refine your property search</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Filter Tabs - Made sticky */}
          <div className="flex gap-2 p-4 overflow-x-auto hide-scrollbar">
            {[
              { id: 'basic', label: 'Basic' },
              { id: 'amenities', label: 'Amenities' },
              { id: 'advanced', label: 'Advanced' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'bg-[#1c5bde] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Content - Responsive grid adjustments */}
        <div className="p-4 overflow-y-auto">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Property Type */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Property Type</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {propertyTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => handlePropertyTypeChange(type.id)}
                      className={`flex items-center gap-2 p-3 rounded-xl border transition-colors ${
                        filters.propertyType === type.id
                          ? 'border-[#1c5bde] bg-[#1c5bde]/5 text-[#1c5bde]'
                          : 'border-gray-200 hover:border-[#1c5bde] hover:bg-[#1c5bde]/5'
                      }`}
                    >
                      <type.icon className="w-5 h-5" />
                      <span className="text-sm">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range - Responsive layout */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Min Price</label>
                    <input
                      type="number"
                      value={filters.priceRange.min}
                      onChange={(e) => handleFilterChange('priceRange', { 
                        ...filters.priceRange, 
                        min: e.target.value 
                      })}
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#1c5bde] focus:ring-2 focus:ring-[#1c5bde]/20"
                      placeholder="₦"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Max Price</label>
                    <input
                      type="number"
                      value={filters.priceRange.max}
                      onChange={(e) => handleFilterChange('priceRange', { 
                        ...filters.priceRange, 
                        max: e.target.value 
                      })}
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#1c5bde] focus:ring-2 focus:ring-[#1c5bde]/20"
                      placeholder="₦"
                    />
                  </div>
                </div>
              </div>

              {/* Rooms - Responsive layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Bedrooms</h4>
                  <div className="flex gap-2">
                    {['Any', '1', '2', '3', '4+'].map(num => (
                      <button
                        key={num}
                        onClick={() => handleFilterChange('bedrooms', num)}
                        className={`flex-1 py-2 rounded-lg border transition-colors ${
                          filters.bedrooms === num
                            ? 'border-[#1c5bde] bg-[#1c5bde]/5 text-[#1c5bde]'
                            : 'border-gray-200 hover:border-[#1c5bde] hover:bg-[#1c5bde]/5'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Bathrooms</h4>
                  <div className="flex gap-2">
                    {['Any', '1', '2', '3', '4+'].map(num => (
                      <button
                        key={num}
                        onClick={() => handleFilterChange('bathrooms', num)}
                        className={`flex-1 py-2 rounded-lg border transition-colors ${
                          filters.bathrooms === num
                            ? 'border-[#1c5bde] bg-[#1c5bde]/5 text-[#1c5bde]'
                            : 'border-gray-200 hover:border-[#1c5bde] hover:bg-[#1c5bde]/5'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'amenities' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {amenities.map(amenity => (
                <label
                  key={amenity.label}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    filters.amenities.includes(amenity.label)
                      ? 'border-[#1c5bde] bg-[#1c5bde]/5'
                      : 'border-gray-200 hover:border-[#1c5bde] hover:bg-[#1c5bde]/5'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity.label)}
                    onChange={() => handleFilterChange('amenities', amenity.label)}
                    className="hidden"
                  />
                  <amenity.icon className={`w-5 h-5 ${
                    filters.amenities.includes(amenity.label)
                      ? 'text-[#1c5bde]'
                      : 'text-gray-400'
                  }`} />
                  <span className={`text-sm ${
                    filters.amenities.includes(amenity.label)
                      ? 'text-[#1c5bde]'
                      : 'text-gray-600'
                  }`}>
                    {amenity.label}
                  </span>
                </label>
              ))}
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-6">
              {/* Property Details */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Property Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Property Age</label>
                    <select
                      value={filters.propertyAge}
                      onChange={(e) => handleFilterChange('propertyAge', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#1c5bde] focus:ring-2 focus:ring-[#1c5bde]/20"
                    >
                      <option value="">Any</option>
                      <option value="0-1">0-1 years</option>
                      <option value="1-5">1-5 years</option>
                      <option value="5-10">5-10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Floor Level</label>
                    <select
                      value={filters.floorLevel}
                      onChange={(e) => handleFilterChange('floorLevel', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#1c5bde] focus:ring-2 focus:ring-[#1c5bde]/20"
                    >
                      <option value="">Any</option>
                      <option value="ground">Ground Floor</option>
                      <option value="1-3">1-3 Floor</option>
                      <option value="4-10">4-10 Floor</option>
                      <option value="10+">10+ Floor</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Nearby Facilities */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Distance to Facilities</h4>
                <div className="space-y-3">
                  {[
                    { key: 'schools', label: 'Schools', icon: School },
                    { key: 'hospitals', label: 'Hospitals', icon: Hospital },
                    { key: 'shopping', label: 'Shopping', icon: ShoppingBag },
                    { key: 'transport', label: 'Transport', icon: Train }
                  ].map(facility => (
                    <div key={facility.key} className="flex items-center gap-3">
                      <facility.icon className="w-5 h-5 text-gray-400" />
                      <select
                        value={filters.distanceTo[facility.key]}
                        onChange={(e) => handleFilterChange('distanceTo', {
                          ...filters.distanceTo,
                          [facility.key]: e.target.value
                        })}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-[#1c5bde] focus:ring-2 focus:ring-[#1c5bde]/20"
                      >
                        <option value="">Any distance</option>
                        <option value="<1">Less than 1km</option>
                        <option value="1-3">1-3km</option>
                        <option value="3-5">3-5km</option>
                        <option value="5+">5km+</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Features */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Additional Features</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.furnished}
                      onChange={(e) => handleFilterChange('furnished', e.target.checked)}
                      className="rounded text-[#1c5bde] focus:ring-[#1c5bde]"
                    />
                    <span className="text-sm text-gray-600">Furnished</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.petsAllowed}
                      onChange={(e) => handleFilterChange('petsAllowed', e.target.checked)}
                      className="rounded text-[#1c5bde] focus:ring-[#1c5bde]"
                    />
                    <span className="text-sm text-gray-600">Pets Allowed</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filter Actions - Made sticky */}
        <div className="sticky bottom-3 bg-white border-t border-gray-100 p-4 flex items-center justify-between
                        sm:px-6 md:px-8 lg:px-10">
          <button
            onClick={() => {
              setFilters({
                propertyType: 'all',
                priceRange: { min: '', max: '' },
                bedrooms: 'any',
                bathrooms: 'any',
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
            }}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Clear all
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Apply filters
                onClose();
              }}
              className="px-4 py-2 bg-[#1c5bde] text-white text-sm rounded-lg hover:bg-[#1c5bde]/90 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

// Add custom CSS to hide scrollbar but keep functionality
const style = document.createElement('style');
style.textContent = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
document.head.appendChild(style);

export default AdvancedFilters;