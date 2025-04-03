import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, X, ChevronLeft, ChevronRight, 
  Heart, Share2, Star, Info, 
  MapPin, Building, DollarSign, TrendingUp, 
  Search, SlidersHorizontal, Home, Building2, Briefcase, Crown, Factory, BedDouble, Map, Bath, Square, ArrowLeft,
  Satellite, 
  Sun, 
  Moon, 
  Mountain, 
  Navigation, 
  Compass, 
  Locate,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  List,
  Eye,
  Users,
  Key,
  Clock
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Supercluster from 'supercluster';
import SearchInterface from '../search/SearchInterface';
import { toast } from 'react-hot-toast';
import { LoadingSpinner } from '../common/LoadingSpinner';
import AdvancedFilters from '../filters/AdvancedFilters';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
if (!MAPBOX_TOKEN) {
  console.error('Mapbox token is not configured in .env file');
} else {
  mapboxgl.accessToken = MAPBOX_TOKEN;
}

const propertyTypes = [
  { id: 'all', label: 'All', icon: Building },
  { id: 'homes', label: 'Homes', icon: Home },
  { id: 'apts', label: 'Apts', icon: Building2 },
  { id: 'land', label: 'Land', icon: Map },
];

const priceRanges = [
  { id: 'any', label: 'Any Price' },
  { id: '0-50m', label: '₦0 - ₦50M' },
  { id: '50m-100m', label: '₦50M - ₦100M' },
  { id: '100m-200m', label: '₦100M - ₦200M' },
  { id: '200m+', label: '₦200M+' }
];

const bedroomOptions = [
  { id: 'any', label: 'Any' },
  { id: '1', label: '1' },
  { id: '2', label: '2' },
  { id: '3', label: '3' },
  { id: '4', label: '4+' }
];

const mapStyles = [
  {
    id: 'streets',
    name: 'Streets',
    url: 'mapbox://styles/mapbox/streets-v12',
    icon: Map
  },
  {
    id: 'satellite',
    name: 'Satellite',
    url: 'mapbox://styles/mapbox/satellite-streets-v12',
    icon: Satellite
  },
  {
    id: 'light',
    name: 'Light',
    url: 'mapbox://styles/mapbox/light-v11',
    icon: Sun
  },
  {
    id: 'dark',
    name: 'Dark',
    url: 'mapbox://styles/mapbox/dark-v11',
    icon: Moon
  },
  {
    id: 'outdoors',
    name: 'Outdoors',
    url: 'mapbox://styles/mapbox/outdoors-v12',
    icon: Mountain
  }
];

const PropertyCard = ({ property, onClick, onMouseEnter, onMouseLeave, isExpanded, socialProof }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onMouseEnter?.(property);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onMouseLeave?.(property);
  };

  return (
    <motion.div
      layout
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="bg-white rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-lg transition-all duration-300"
    >
      <div className="relative">
        {/* Social Proof Banner */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-center z-10">
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-medium text-gray-700 flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {socialProof.viewCounts[property.id]} views today
          </div>
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-medium text-gray-700 flex items-center gap-1">
            <Heart className="w-4 h-4" />
            {socialProof.savedProperties[property.id]} saved
          </div>
        </div>
        
        {/* Urgency Indicator */}
        {Math.random() > 0.7 && (
          <div className="absolute bottom-2 left-2 right-2 bg-red-500/90 text-white px-3 py-1 rounded-lg text-sm font-medium backdrop-blur-sm">
            <Clock className="w-4 h-4 inline mr-1" />
            {Math.floor(Math.random() * 3) + 1} people viewing now
          </div>
        )}
        
        {/* Image Carousel */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={{ x: `-${imageIndex * 100}%` }}
            transition={{ type: "tween", duration: 0.3 }}
            style={{ display: 'flex' }}
          >
            {property.images.map((image, idx) => (
              <div
                key={idx}
                className="relative w-full h-full flex-shrink-0"
                style={{ aspectRatio: '4/3' }}
              >
                <img
                  src={image}
                  alt={`${property.title} - Image ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </motion.div>

          {/* Image Navigation */}
          {property.images.length > 1 && (
            <>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {property.images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-colors
                      ${idx === imageIndex ? 'bg-white' : 'bg-white/50'}`
                    }
                  />
                ))}
              </div>
              {imageIndex > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageIndex(i => i - 1);
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/90 hover:bg-white shadow-md"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              {imageIndex < property.images.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageIndex(i => i + 1);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/90 hover:bg-white shadow-md"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </>
          )}

          {/* Top Actions */}
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Add to saved logic
              }}
              className="p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-colors"
            >
              <Heart className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Share logic
              }}
              className="p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Property Status Badge */}
          {property.status && (
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 text-xs font-medium bg-primary-500 text-white rounded-full">
                {property.status}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title and Price */}
          <div className="flex justify-between items-start gap-4 mb-2">
            <h3 className="property-card-title flex-1">
              {property.title}
            </h3>
            <p className="property-card-price whitespace-nowrap">
              ₦{parseInt(property.price).toLocaleString()}
            </p>
          </div>

          {/* Location */}
          <p className="property-card-location flex items-center gap-1 mb-3">
            <MapPin className="w-4 h-4" />
            {property.location}
          </p>

          {/* Features */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
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

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t"
              >
                <p className="text-sm text-gray-600 mb-4">
                  {property.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const MapView = ({ properties = [], onClose, filters: initialFilters = {} }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapStyle, setMapStyle] = useState('light-v11');
  const [showLayerOptions, setShowLayerOptions] = useState(false);
  const [viewMode, setViewMode] = useState('split');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [expandedProperty, setExpandedProperty] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [filterValues, setFilterValues] = useState(initialFilters || {});
  const [socialProof, setSocialProof] = useState({
    activeViewers: Math.floor(Math.random() * 50) + 100,
    recentBookings: Math.floor(Math.random() * 10) + 5,
    savedProperties: {},
    viewCounts: {}
  });
  const navigate = useNavigate();

  // Initialize view counts and saved counts for properties
  useEffect(() => {
    const newViewCounts = {};
    const newSavedCounts = {};
    properties.forEach(prop => {
      newViewCounts[prop.id] = Math.floor(Math.random() * 100) + 50;
      newSavedCounts[prop.id] = Math.floor(Math.random() * 20) + 5;
    });
    setSocialProof(prev => ({
      ...prev,
      viewCounts: newViewCounts,
      savedProperties: newSavedCounts
    }));
  }, [properties]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile && viewMode === 'split') {
        setViewMode('map');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  // Initialize map only once
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: `mapbox://styles/mapbox/${mapStyle}`,
      center: [7.491, 9.082],
      zoom: 12,
      pitch: 45,
      bearing: -17.6
    });

    map.current = mapInstance;

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update map style
  useEffect(() => {
    if (!map.current) return;
    map.current.setStyle(`mapbox://styles/mapbox/${mapStyle}`);
  }, [mapStyle]);

  // Handle property markers
  useEffect(() => {
    if (!map.current || !properties.length) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Wait for style to load before adding markers
    const addMarkers = () => {    
      markersRef.current = properties.map((property) => {
        const markerElement = document.createElement('div');
        markerElement.className = 'marker';
        markerElement.style.backgroundImage = `url(${property.images[0]})`;
        markerElement.style.backgroundSize = 'cover';
        markerElement.style.width = '100px';
        markerElement.style.height = '100px';
        markerElement.style.borderRadius = '10px';

        const marker = new mapboxgl.Marker({ element: markerElement, offset: [0, -25] })
          .setLngLat(property.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 50 })
              .setHTML(`
                <div class="card-container p-2 border-2 shadow-md">
                <img src="${property.images[0]}" alt="${property.title}" class="w-full h-32 object-cover rounded-t mb-2"/>
                <div class="text-container p-2">
                 <h3 class="font-bold">${property.title}</h3>
                 <p class="text-sm text-gray-600">${property.location}</p>
                 <p class="font-bold mt-2">₦${property.price}</p>
                </div>
                </div>
              `)
          )
          .addTo(map.current);

        return marker;
      });
      setIsLoading(false);
    };

    if (map.current.isStyleLoaded()) {
      addMarkers();
    } else {
      map.current.once('style.load', addMarkers);
    }

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, [properties, map.current?.isStyleLoaded()]);

  // Update filterValues only when initialFilters changes
    console.log("Properties:", properties);
  useEffect(() => {
    const newFilters = initialFilters || {};
    if (JSON.stringify(filterValues) !== JSON.stringify(newFilters)) {
      setFilterValues(newFilters);
    }
  }, [initialFilters]);

  const handleLocateUser = useCallback(() => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (map.current) {
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 15
          });
        }
        setUserLocation([longitude, latitude]);
        setIsLocating(false);
      },
      () => {
        toast.error('Could not get your location');
        setIsLocating(false);
      }
    );
  }, []);

  const handlePropertyClick = useCallback((property) => {
    if (property && property.id) {
      navigate(`/property/${property.id}`);
    }
  }, [navigate]);

  const handlePropertyHover = useCallback((property) => {
    setExpandedProperty(property);
  }, []);

  const handleFilterApply = useCallback((newFilters) => {
    setFilterValues(newFilters);
    setIsFilterDrawerOpen(false);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-white">
      {/* Social Proof Banner */}
      <div className="bg-blue-500 text-white py-2 px-4">
        <div className="flex justify-center items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {socialProof.activeViewers} people searching now
          </div>
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            {socialProof.recentBookings} properties booked today
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Updated in real-time
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="absolute pt-2 top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="flex items-center h-16 px-4 gap-2">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex-1">
            <SearchInterface 
              onSearch={({ query, filters }) => {
                setFilterValues(filters);
              }}
              initialFilters={filterValues}
              showTrending={false}
              enhancedView={true}
              variant="compact"
              activeCategory={activeFilter}
              onCategoryChange={setActiveFilter}
              showAIChat={false}
            />
          </div>

          {isMobile && (
            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              {viewMode === 'list' ? <List className="w-5 h-5" /> : <Map className="w-5 h-5" />}
            </button>
          )}
        </div>

        {/* Filter Pills - Scrollable */}
        <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:border-gray-300"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          {propertyTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setActiveFilter(type.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${activeFilter === type.id ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 hover:border-gray-300'}`
              }
            >
              <type.icon className="w-4 h-4" />
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="absolute inset-0 pt-28">
        {/* Map View */}
        <div
          className={`absolute inset-0 ${
            !isMobile && viewMode === 'split' ? 'left-[400px]' : ''
          } `}
            style={{
              width:
                !isMobile && viewMode === 'split'
                  ? 'calc(100% - 400px)'
                  : '100%',
              transition: 'width 0.3s ease-in-out, left 0.3s ease-in-out',
            }}
          >
          <div ref={mapContainer} className="w-full h-full"  />
          
          {/* Map Controls - Left side */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            <div className="bg-white rounded-lg shadow-lg p-2 space-y-2">
              <button onClick={() => setMapStyle('streets-v11')} className="p-2 rounded hover:bg-gray-100">
                <Map className="w-5 h-5" />
              </button>
              <button onClick={() => setMapStyle('satellite-v9')} className="p-2 rounded hover:bg-gray-100">
                <Satellite className="w-5 h-5" />
              </button>
              <div className="border-t border-gray-200" />
              <button onClick={() => map.current?.zoomIn()} className="p-2 rounded hover:bg-gray-100">
                <ZoomIn className="w-5 h-5" />
              </button>
              <button onClick={() => map.current?.zoomOut()} className="p-2 rounded hover:bg-gray-100">
                <ZoomOut className="w-5 h-5" />
              </button>
              <div className="border-t border-gray-200" />
              <button onClick={handleLocateUser} className="p-2 rounded hover:bg-gray-100">
                <Navigation className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Sheet Property List */}
        <div
          className={`fixed bottom-32 bg-white shadow-lg transition-transform duration-300  ${
            isMobile
              ? viewMode === 'list'
                ? 'translate-y-0 left-0 right-0'
                : 'translate-y-[calc(100%-60px)] left-0 right-0'
              : 'top-28 left-0 w-[400px] translate-y-0'
          }`}
        >
          {/* Handle for mobile */}
          {isMobile && (
            <div
              className="h-[30px] flex items-center justify-center cursor-pointer border-b "
              onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
            >
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
              <span className="text-sm text-gray-500 ml-2">
                {properties.length} Properties Found 
              </span>
            </div>
          )}

          {/* Horizontal scrolling property list for mobile */}
          <div
            className={`overflow-hidden ${isMobile ? 'h-[50vh]' : 'h-full'}`}
          >
            <div
              className={`h-full ${
                isMobile
                  ? 'flex overflow-x-auto hide-scrollbar snap-x snap-mandatory'
                  : 'block overflow-y-auto'
              }`}
            >
              {properties.map((property) => (
                <div
                  key={property.id}
                  className={`${isMobile ? 'snap-center w-[calc(100%-1rem)] p-4 mx-2' : 'p-4 border-b'}`}
                  >
                    <PropertyCard
                      property={property}
                      socialProof={socialProof}
                      onClick={() => handlePropertyClick(property)}
                      onMouseEnter={() => handlePropertyHover(property)}
                      onMouseLeave={() => handlePropertyHover(null)}
                      isExpanded={expandedProperty?.id === property.id}
                    />
                  </div>
              ))} 
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 bg-white flex items-center justify-center z-50">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Filter Drawer */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-xl shadow-lg"
            style={{ maxHeight: '90vh' }}
          >
            <AdvancedFilters
              onClose={() => setIsFilterDrawerOpen(false)}
              onApply={handleFilterApply}
              initialFilters={filterValues}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapView;
