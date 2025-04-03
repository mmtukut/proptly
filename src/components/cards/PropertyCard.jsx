import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, Star, MapPin, BedDouble, Bath, Square, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSavedProperties } from '../../contexts/SavedPropertiesContext';

const PropertyCard = ({ 
  property, 
  size = 'default',  // 'default', 'large', 'grid'
  showStats = true,
  className = '' 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const imageContainerRef = useRef(null);
  const navigate = useNavigate();
  const { savedProperties, toggleSavedProperty } = useSavedProperties();
  const isSaved = savedProperties.includes(property.id);

  // Responsive image sizes based on card size
  const imageSizes = {
    default: 'aspect-[4/3]',
    large: 'aspect-[16/9]',
    grid: 'aspect-square'
  };

  // Social proof data (simulated)
  const viewCount = Math.floor(Math.random() * 100) + 50;
  const rating = (Math.random() * (5 - 4.3) + 4.3).toFixed(1);

  const handleImageNavigation = (direction) => {
    if (direction === 'next' && currentImageIndex < property.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    } else if (direction === 'prev' && currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  // Touch handling for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;

    const currentTouch = e.touches[0].clientX;
    const diff = touchStart - currentTouch;

    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        handleImageNavigation('next');
      } else {
        handleImageNavigation('prev');
      }
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  return (
    <motion.div
      layout
      className={`group relative bg-white rounded-xl overflow-hidden ${className}
        ${size === 'large' ? 'md:flex md:gap-4' : 'flex flex-col'}
        hover:shadow-lg transition-all duration-300`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/property/${property.id}`)}
    >
      {/* Image Section */}
      <div 
        className={`relative ${imageSizes[size]} ${size === 'large' ? 'md:w-2/3' : 'w-full'}`}
        ref={imageContainerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute inset-0 flex overflow-hidden">
          <motion.div
            className="flex"
            initial={false}
            animate={{ x: `-${currentImageIndex * 100}%` }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            {property.images.map((image, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-full ${imageSizes[size]}`}
              >
                <img
                  src={image}
                  alt={`${property.title} - Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Image Navigation */}
        <AnimatePresence>
          {(isHovered || size === 'large') && property.images.length > 1 && (
            <>
              {currentImageIndex > 0 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageNavigation('prev');
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-md z-10"
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.button>
              )}
              {currentImageIndex < property.images.length - 1 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageNavigation('next');
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-md z-10"
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              )}
            </>
          )}
        </AnimatePresence>

        {/* Image Indicators */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {property.images.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-colors
                ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
            />
          ))}
        </div>

        {/* Top Actions */}
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              toggleSavedProperty(property.id);
            }}
            className={`p-2 rounded-full shadow-md transition-colors
              ${isSaved 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 hover:bg-white text-gray-700'}`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              // Share functionality
            }}
            className="p-2 rounded-full bg-white/90 hover:bg-white shadow-md text-gray-700"
          >
            <Share2 className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Social Proof */}
        <div className="absolute top-2 left-2 flex gap-2 z-10">
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-medium text-gray-700 flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            {rating}
          </div>
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-medium text-gray-700 flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {viewCount}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className={`p-4 flex flex-col ${size === 'large' ? 'md:w-1/3' : 'w-full'}`}>
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-semibold text-gray-900">
            {property.title}
          </h3>
          <p className="whitespace-nowrap text-lg font-semibold text-blue-600">
            ₦{property.price.toLocaleString()}
          </p>
        </div>

        <p className="flex items-center gap-1 text-gray-500 mt-1">
          <MapPin className="w-4 h-4" />
          {property.location}
        </p>

        {showStats && (
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <BedDouble className="w-4 h-4" />
              {property.bedrooms} {property.bedrooms === 1 ? 'bed' : 'beds'}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              {property.bathrooms} {property.bathrooms === 1 ? 'bath' : 'baths'}
            </span>
            <span className="flex items-center gap-1">
              <Square className="w-4 h-4" />
              {property.area}
            </span>
          </div>
        )}

        {size === 'large' && (
          <p className="mt-4 text-gray-600 line-clamp-3">
            {property.description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default PropertyCard;