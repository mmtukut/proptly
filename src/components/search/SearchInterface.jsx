import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Mic, Sliders, X, Crown, Building2, Clock, TrendingUp, Home, Coins, BedDouble, Bath, Star, Square, Building, Zap, Droplet, Car, Trees, Shield, Wifi, UtensilsCrossed, Sparkles, Percent, BadgeCheck, Check, Store, TreePine, Users, Lightbulb, Flame, Folder } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { Tooltip } from 'react-tooltip';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import AdvancedFilters from '../filters/AdvancedFilters';
import { useNavigate } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce';

const SearchInterface = ({ 
  onSearch, 
  initialFilters,
  showTrending = true,
  categories = [],
  activeCategory,
  onCategoryChange,
  enhancedView = false,
  variant = 'default'
}) => {
  // Enhanced state management
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useLocalStorage('recentSearches', []);
  const [savedSearches, setSavedSearches] = useLocalStorage('savedSearches', []);
  const searchRef = useRef(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('type');
  const [localFilters, setLocalFilters] = useState(initialFilters || {});
  const [suggestions, setSuggestions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  
  // Enhanced filters state
  const [filters, setFilters] = useState({
    propertyType: [],
    priceRange: { min: '', max: '' },
    bedrooms: '',
    bathrooms: '',
    amenities: [],
    furnished: false,
    availability: '',
    sortBy: 'relevance',
    // Advanced filters
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

  // FastFind branding colors
  const brandColors = {
    primary: '#1c5bde', // FastFind blue
    secondary: '#6366f1', // Indigo
    accent: '#f43f5e' // Rose
  };

  // Real estate specific suggestions
  const searchPatterns = {
    locations: [
      { text: 'Gombe State University Area', type: 'popular', count: 25 },
      { text: 'Federal College of Education', type: 'trending', count: 15 },
      { text: 'New Mile 3', type: 'popular', count: 20 },
      { text: 'Tumfure', type: 'recent', count: 10 },
      { text: 'Orji Quarter', type: 'trending', count: 18 }
    ],
    propertyTypes: [
      { text: '2 Bedroom Flat', priceRange: '₦150k - ₦300k', available: 12 },
      { text: 'Self Contained', priceRange: '₦80k - ₦150k', available: 25 },
      { text: '3 Bedroom Apartment', priceRange: '₦350k - ₦500k', available: 8 },
      { text: 'Single Room', priceRange: '₦40k - ₦70k', available: 30 },
      { text: 'Duplex', priceRange: '₦800k - ₦1.2M', available: 5 }
    ],
    amenities: [
      { text: '24/7 Power Supply', properties: 45 },
      { text: 'Security', properties: 38 },
      { text: 'Water Supply', properties: 50 },
      { text: 'Parking Space', properties: 42 },
      { text: 'Furnished', properties: 15 }
    ],
    budget: [
      '₦50k - ₦100k per year',
      '₦100k - ₦200k per year',
      '₦200k - ₦500k per year',
      'Above ₦500k per year'
    ]
  };

  // Filter options
  const filterOptions = {
    propertyType: ['Apartment', 'Villa', 'Duplex', 'Self Contain', 'Single Room'],
    priceRange: [
      { label: 'Under ₦500k', value: '0-500000' },
      { label: '₦500k - ₦1M', value: '500000-1000000' },
      { label: '₦1M - ₦2M', value: '1000000-2000000' },
      { label: 'Above ₦2M', value: '2000000-999999999' }
    ],
    beds: ['1', '2', '3', '4+'],
    amenities: ['24/7 Power', 'Security', 'Water Supply', 'Parking', 'Furnished'],
    availability: ['Immediate', '1 Month Notice', 'Coming Soon']
  };

  // Enhanced categories that include property types
  const enhancedCategories = [
    { id: 'all', label: 'All Properties', icon: Home },
    { id: 'residential', label: 'Residential', icon: Building2, subcategories: [
      'Apartment', 'House', 'Duplex', 'Self Contain', 'Single Room'
    ]},
    { id: 'commercial', label: 'Commercial', icon: Store, subcategories: [
      'Office Space', 'Shop', 'Warehouse', 'Plaza'
    ]},
    { id: 'shortlet', label: 'Short Stay', icon: Clock, subcategories: [
      'Apartment', 'House', 'Room'
    ]},
    { id: 'land', label: 'Land & Plots', icon: TreePine }
  ];

  // Search history management
  const addToRecentSearches = (query, appliedFilters) => {
    const newSearch = {
      id: Date.now(),
      query,
      filters: appliedFilters,
      timestamp: new Date().toISOString()
    };

    setRecentSearches(prev => {
      const updated = [newSearch, ...prev.slice(0, 4)];
      return updated;
    });
  };

  // Save search functionality
  const saveSearch = (query, appliedFilters) => {
    const newSavedSearch = {
      id: Date.now(),
      query,
      filters: appliedFilters,
      timestamp: new Date().toISOString(),
      name: `Search ${savedSearches.length + 1}` // Allow users to rename
    };

    setSavedSearches(prev => [...prev, newSavedSearch]);
  };

  // Enhanced search handler with relevance scoring
  const handleSearch = () => {
    const searchData = {
      query: searchQuery,
      filters,
      timestamp: new Date().toISOString()
    };

    // Add to recent searches
    addToRecentSearches(searchQuery, filters);

    // Calculate relevance score based on filters
    const relevanceScore = calculateRelevanceScore(searchData);

    // Pass search data to parent with relevance score
    onSearch({ ...searchData, relevanceScore });
  };

  // Relevance score calculation
  const calculateRelevanceScore = (searchData) => {
    let score = 0;
    
    // Query length weight
    if (searchData.query.length > 3) score += 10;
    
    // Filter completeness weight
    const filledFilters = Object.entries(searchData.filters).filter(([_, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object') return Object.values(value).some(v => v !== '');
      return value !== '' && value !== false;
    });
    
    score += filledFilters.length * 5;
    
    // Price range weight
    if (searchData.filters.priceRange.min && searchData.filters.priceRange.max) {
      score += 15;
    }
    
    // Location specificity weight
    if (searchData.filters.nearbyFacilities.length > 0) {
      score += 20;
    }

    return score;
  };

  // Generate real-time suggestions based on input
  const generateSuggestions = (input) => {
    console.log('generateSuggestions input:', input);
    if (!input) return [];
    const lowerInput = input.toLowerCase();
    let newSuggestions = [];
  
    // Comprehensive Pattern Matching
    const patterns = [
      {
        keywords: ['near', 'around', 'close', 'by', 'in'],
        type: 'location',
        heading: 'Nearby Locations',
        filter: (loc) => searchPatterns.locations.some(l => loc.includes(l.text.toLowerCase())),
        map: (loc) => ({
          icon: MapPin,
          text: loc,
          subtext: `${searchPatterns.locations.find(l => loc.includes(l.text.toLowerCase()))?.count || 0} properties available`,
          badge: searchPatterns.locations.find(l => loc.includes(l.text.toLowerCase()))?.type || 'popular',
        }),
      },
      {
        keywords: ['room', 'flat', 'house', 'apartment', 'duplex', 'self contain', 'single room', 'home', 'residential'],
        type: 'property',
        heading: 'Available Properties',
        filter: (prop) => searchPatterns.propertyTypes.some(p => prop.includes(p.text.toLowerCase())),
        map: (prop) => {
          const propertyMatch = searchPatterns.propertyTypes.find(p => prop.includes(p.text.toLowerCase()));
          return {
            icon: Building2,
            text: propertyMatch ? propertyMatch.text : prop,
            subtext: propertyMatch ? `${propertyMatch.available} available • ${propertyMatch.priceRange}` : '',
            badge: 'verified',
          };
        },
      },
      {
        keywords: ['₦', 'budget', 'price', 'cost', 'affordable'],
        type: 'budget',
        heading: 'Price Ranges',
        filter: (budget) => searchPatterns.budget.some(b => budget.includes(b.toLowerCase())),
        map: (budget) => ({
          icon: Coins,
          text: budget,
          subtext: 'Click to see properties',
          badge: 'price',
        }),
      },
      {
        keywords: ['with', 'has', 'include', 'have', 'features'],
        type: 'amenity',
        heading: 'Property Features',
        filter: (amenity) => searchPatterns.amenities.some(a => amenity.includes(a.text.toLowerCase())),
        map: (amenity) => {
          const amenityMatch = searchPatterns.amenities.find(a => amenity.includes(a.text.toLowerCase()));
          return {
            icon: Check,
            text: amenityMatch ? amenityMatch.text : amenity,
            subtext: amenityMatch ? `${amenityMatch.properties} properties available` : '',
            badge: 'feature',
          };
        },
      },
    ];
  
    // Generate suggestions
    patterns.forEach(pattern => {
      if (pattern.keywords.some(keyword => lowerInput.includes(keyword))) {
        console.log(`${pattern.type} suggestions triggered`);
        let relevantItems = [];
        if (pattern.type === 'location'){
          relevantItems = searchPatterns.locations.filter(item => pattern.filter(item.text.toLowerCase())).map(item => item.text.toLowerCase());
        } else if (pattern.type === 'property') {
          relevantItems = searchPatterns.propertyTypes.filter(item => pattern.filter(item.text.toLowerCase())).map(item => item.text.toLowerCase());
        } else if(pattern.type === 'budget'){
          relevantItems = searchPatterns.budget.filter(item => pattern.filter(item.toLowerCase())).map(item => item.toLowerCase());
        }else{
          relevantItems = searchPatterns.amenities.filter(item => pattern.filter(item.text.toLowerCase())).map(item => item.text.toLowerCase());
        }
        newSuggestions.push({
          type: pattern.type,
          heading: pattern.heading,
          items: relevantItems.map(item => pattern.map(item)),
        });
      }
    });
  
    setSuggestions(newSuggestions);
    console.log('generateSuggestions newSuggestions:', newSuggestions);
  };
  
  // Voice search functionality
  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-NG';
      
      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          processVoiceCommand(transcript);
          setIsListening(false);
      };

      const processVoiceCommand = async (transcript) => {
        // Use LLM to interpret the voice transcript
        const response = await fetch('/api/process-voice-command', { // Assuming you have a server endpoint
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ transcript }),
        });
    
        const data = await response.json();
        // Example data structure:
        // {
        //   location: "Gombe State University Area",
        //   propertyType: "2 Bedroom Flat",
        //   priceRange: "150k - 300k",
        //   amenities: ["24/7 Power Supply", "Security"]
        // }
    
        const { location, propertyType, priceRange, amenities } = data;

        const newSearch = {
          location,
          propertyType,
          priceRange,
          amenities
        }
        console.log('voice command:', newSearch)
        setSearchQuery(location);
    
        handleSearch(newSearch);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Voice search is not supported in your browser');
    }
  };

  // Handle filter changes
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

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      propertyType: [],
      priceRange: { min: '', max: '' },
      bedrooms: '',
      bathrooms: '',
      amenities: [],
      furnished: false,
      availability: '',
      sortBy: 'relevance',
      // Advanced filters
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
  };

  // Handle clicks outside of search component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setSearchQuery(input);
    setIsTyping(true);
    generateSuggestions(input);
  };

  const handleInputBlur = () => {
    setIsTyping(false);
  };

  useEffect(() => {
    console.log('searchQuery:', searchQuery, 'suggestions:', suggestions);
  }, [searchQuery, suggestions]);

  return (
    <div className="relative max-w-6xl mx-auto px-4">
      {/* Enhanced Search Bar with Smart Defaults */}
      <div className="relative group">
        {/* Ambient Animation Background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#1c5bde]/20 via-[#6366f1]/20 to-[#f43f5e]/20 
                      rounded-full opacity-0 group-hover:opacity-100 blur transition duration-500" />
        
        {/* Main Search Container with Social Proof */}
        <div className="relative flex items-center bg-white rounded-full 
                      border border-gray-200 hover:border-[#1c5bde] hover:shadow-lg
                      transition-all duration-300">
          
          {/* AI Assistant Badge with Enhanced Tooltip */}
          <div className="absolute left-4 flex items-center gap-2" id="ai-badge-tooltip">
            <div className="relative">
              <div className="p-2 bg-[#1c5bde]/10 rounded-full">
                <Sparkles className="h-5 w-5 text-[#1c5bde]" />
              </div>
              <motion.div 
                className="absolute inset-0 bg-[#1c5bde]/20 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </div>

          <Tooltip
            anchorId="ai-badge-tooltip"
            content={
              <div className="max-w-xs">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-yellow-400" />
                  <span className="font-medium">Smart Search</span>
                </div>
                <p className="text-sm">Try natural phrases like:</p>
                <ul className="text-sm mt-1 space-y-1">
                  <li className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-green-400" />
                    "3 bedroom apartment near Federal College"
                  </li>
                  <li className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-green-400" />
                    "Houses with 24/7 power in Tumfure"
                  </li>
                </ul>
              </div>
            }
            place="bottom"
          />

          {/* Enhanced Search Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="Try '3 bedroom apartment near Federal College'"
            className="w-full pl-16 pr-32 py-5 bg-transparent rounded-full
                     text-lg placeholder:text-gray-400 text-gray-700
                     focus:outline-none focus:ring-2 focus:ring-[#1c5bde]/20"
          />

          {/* Enhanced Action Buttons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3">
            {/* Voice Search with Feedback */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVoiceSearch}
              className={`relative p-3 rounded-full transition-all duration-300 
                ${isListening 
                  ? 'bg-[#1c5bde] text-white shadow-lg' 
                  : 'bg-gray-50 text-gray-500 hover:bg-[#1c5bde]/10 hover:text-[#1c5bde]'
                }`}
              title="Search with voice"
            >
              <Mic className={`h-5 w-5 ${isListening && 'animate-pulse'}`} />
              {isListening && (
                <motion.span
                  className="absolute -top-1 -right-1 w-3 h-3 bg-[#1c5bde] rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.button>

            {/* Animated Divider */}
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent" />

            {/* Enhanced Filters Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`relative p-3 rounded-full transition-all duration-300 
                ${showFilters 
                  ? 'bg-[#1c5bde] text-white shadow-lg' 
                  : 'bg-gray-50 text-gray-500 hover:bg-[#1c5bde]/10 hover:text-[#1c5bde]'
                }`}
              title="Advanced filters"
            >
              <Sliders className="h-5 w-5" />
              {showFilters && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-[#1c5bde] rounded-full"
                />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Enhanced Search Suggestions */}
      <AnimatePresence>
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl 
                     border border-gray-100 overflow-hidden z-50"
          >
            {/* Quick Stats - Social Proof */}
            <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-transparent border-b border-gray-100">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#1c5bde]" />
                  <span className="text-gray-600">
                    <span className="font-medium">2.5k+</span> searching now
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-gray-600">
                    High demand in this area
                  </span>
                </div>
              </div>
            </div>

            {/* Smart Suggestions */}
            <div className="p-4">
              <div className="space-y-4">
                {suggestions.map((group, index) => (
                  <div key={group.type} className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      {group.type === 'location' && <MapPin className="h-4 w-4" />}
                      {group.type === 'property' && <Building2 className="h-4 w-4" />}
                      {group.type === 'amenity' && <Check className="h-4 w-4" />}
                      {group.heading}
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {group.items.map((item, i) => (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => {
                            setSearchQuery(item.text);
                            handleSearch();
                          }}
                          className="flex items-center gap-3 w-full p-3 hover:bg-[#1c5bde]/5 
                                   rounded-xl transition-all group"
                        >
                          <item.icon className="h-5 w-5 text-gray-400 group-hover:text-[#1c5bde]" />
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-gray-700 group-hover:text-[#1c5bde]">
                              {item.text}
                            </p>
                            {item.subtext && (
                              <p className="text-xs text-gray-500">{item.subtext}</p>
                            )}
                          </div>
                          {item.badge && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium
                              ${item.badge === 'trending' ? 'bg-orange-100 text-orange-600' : 
                                item.badge === 'popular' ? 'bg-green-100 text-green-600' : 
                                'bg-blue-100 text-blue-600'}
                            `}>
                              {item.badge}
                            </span>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Searches with Clear Hierarchy */}
            {recentSearches.length > 0 && (
              <div className="border-t border-gray-100">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recent Searches
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {recentSearches.map((search, index) => (
                      <motion.button
                        key={search.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          setSearchQuery(search.query);
                          handleSearch();
                        }}
                        className="flex items-center gap-3 w-full p-3 hover:bg-[#1c5bde]/5 
                                 rounded-xl transition-all group"
                      >
                        <Clock className="h-4 w-4 text-gray-400 group-hover:text-[#1c5bde]" />
                        <span className="text-sm text-gray-600 group-hover:text-[#1c5bde]">
                          {search.query}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <AdvancedFilters
            filters={filters}
            setFilters={setFilters}
            onClose={() => setShowFilters(false)}
          />
        )}
      </AnimatePresence>

      {/* Enhanced Categories Section */}
      {enhancedView && categories.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <motion.div 
              className="p-1.5 bg-[#1c5bde]/10 rounded-full"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Building2 className="w-4 h-4 text-[#1c5bde]" />
            </motion.div>
            <h3 className="text-sm font-medium text-gray-700">Popular Categories</h3>
          </div>

          <div className="flex space-x-3 overflow-x-auto hide-scrollbar pb-2">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCategoryChange(category.id)}
                className={`relative flex items-center gap-2 px-6 py-3.5 rounded-xl whitespace-nowrap transition-all
                  ${activeCategory === category.id
                    ? 'bg-[#1c5bde] text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-[#1c5bde]/5 border border-gray-200'
                  }`}
              >
                {/* Category Icon */}
                <category.icon className={`h-5 w-5 ${activeCategory === category.id ? 'text-white' : 'text-[#1c5bde]'}`} />
                
                {/* Category Label */}
                <span className="font-medium">{category.label}</span>

                {/* Category Badges */}
                {category.popular && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-green-500 text-white text-[10px] font-medium rounded-full">
                    Popular
                  </span>
                )}
                {category.new && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-orange-500 text-white text-[10px] font-medium rounded-full">
                    New
                  </span>
                )}
                {category.highlight && (
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-[#1c5bde]"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Trending Searches */}
      {showTrending && (
        <div className="mt-8">
          {/* Trending Header with Animation */}
          <div className="flex items-center gap-3 mb-4">
            <motion.div 
              className="p-1.5 bg-orange-100 rounded-full"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Flame className="w-4 h-4 text-orange-500" />
            </motion.div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Trending Now</h3>
              <p className="text-xs text-gray-500">Based on recent searches in your area</p>
            </div>
          </div>

          {/* Trending Items Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { text: 'Near Federal College', count: '2.5k searches', type: 'location' },
              { text: 'Newly Built Apartments', count: '1.8k searches', type: 'property' },
              { text: 'Gated Communities', count: '1.2k searches', type: 'feature' },
              { text: 'Student Housing', count: '950 searches', type: 'category' },
              { text: 'Business Districts', count: '850 searches', type: 'location' },
              { text: 'Family Homes', count: '750 searches', type: 'property' }
            ].map((trend, index) => (
              <motion.button
                key={trend.text}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSearchQuery(trend.text);
                  handleSearch();
                }}
                className="group flex flex-col gap-1 p-4 bg-white border border-gray-200 
                         hover:border-[#1c5bde] hover:shadow-lg rounded-xl transition-all"
              >
                <div className="flex items-center gap-2">
                  {trend.type === 'location' && <MapPin className="w-4 h-4 text-[#1c5bde]" />}
                  {trend.type === 'property' && <Building2 className="w-4 h-4 text-[#1c5bde]" />}
                  {trend.type === 'feature' && <Check className="w-4 h-4 text-[#1c5bde]" />}
                  {trend.type === 'category' && <Folder className="w-4 h-4 text-[#1c5bde]" />}
                  <span className="text-sm font-medium text-gray-700 group-hover:text-[#1c5bde]">
                    {trend.text}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{trend.count}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
};

const FilterModal = ({ isOpen, onClose, filters, onFilterChange }) => {
  const [activeTab, setActiveTab] = useState('type');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const quickPriceRanges = [
    { label: 'Under ₦500k', min: 0, max: 500000 },
    { label: '₦500k - ₦1M', min: 500000, max: 1000000 },
    { label: '₦1M - ₦2M', min: 1000000, max: 2000000 },
    { label: '₦2M - ₦5M', min: 2000000, max: 5000000 },
    { label: 'Above ₦5M', min: 5000000, max: null }
  ];

  const propertyTypes = [
    { icon: Building2, label: 'Apartment', description: 'Flats & Apartments' },
    { icon: Home, label: 'House', description: 'Single Family Homes' },
    { icon: Building, label: 'Duplex', description: 'Multi-floor Homes' },
    { icon: Square, label: 'Land', description: 'Plots & Land' },
    { icon: Building2, label: 'Commercial', description: 'Offices & Shops' },
    { icon: Home, label: 'Self Contain', description: 'Studio Apartments' }
  ];

  const amenities = [
    { icon: Zap, label: '24/7 Power', category: 'utilities' },
    { icon: Droplet, label: 'Water Supply', category: 'utilities' },
    { icon: Car, label: 'Parking Space', category: 'facilities' },
    { icon: Trees, label: 'Garden', category: 'outdoor' },
    { icon: Shield, label: 'Security', category: 'safety' },
    { icon: Wifi, label: 'Internet', category: 'utilities' },
    { icon: UtensilsCrossed, label: 'Kitchen', category: 'indoor' },
    { icon: Wifi, label: 'Staff Quarters', category: 'facilities' }
  ];

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-4xl w-full bg-white rounded-3xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <Dialog.Title className="text-xl font-semibold text-gray-900">
                  Filter Properties
                </Dialog.Title>
                <p className="text-sm text-gray-500 mt-1">
                  Find your perfect property with our advanced filters
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Quick Filters */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: Crown, label: 'Luxury' },
                  { icon: Sparkles, label: 'New' },
                  { icon: Clock, label: 'Ready to Move' },
                  { icon: BadgeCheck, label: 'Verified' },
                  { icon: Percent, label: 'Special Offer' }
                ].map((filter) => (
                  <button
                    key={filter.label}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 
                             hover:border-[#1c5bde] hover:bg-[#1c5bde]/5 transition-all group"
                  >
                    <filter.icon className="w-4 h-4 text-gray-400 group-hover:text-[#1c5bde]" />
                    <span className="text-sm text-gray-600 group-hover:text-[#1c5bde]">
                      {filter.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Filter Content */}
            <div className="grid grid-cols-3 gap-6 p-6">
              {/* Property Type */}
              <div className="col-span-3 md:col-span-1">
                <h3 className="font-medium mb-3">Property Type</h3>
                <div className="space-y-2">
                  {propertyTypes.map((type) => (
                    <button
                      key={type.label}
                      className="flex items-center gap-3 w-full p-3 rounded-xl border border-gray-200 
                               hover:border-[#1c5bde] hover:bg-[#1c5bde]/5 transition-all group"
                    >
                      <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-white">
                        <type.icon className="w-5 h-5 text-gray-600 group-hover:text-[#1c5bde]" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900 group-hover:text-[#1c5bde]">
                          {type.label}
                        </div>
                        <div className="text-sm text-gray-500">
                          {type.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range & Rooms */}
              <div className="col-span-3 md:col-span-2 space-y-6">
                {/* Price Range */}
                <div>
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm text-gray-600">Minimum</label>
                      <div className="mt-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
                        <input
                          type="number"
                          placeholder="0"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                          className="w-full pl-7 pr-4 py-2 border border-gray-200 rounded-lg focus:border-[#1c5bde] focus:ring-2 focus:ring-[#1c5bde]/20"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Maximum</label>
                      <div className="mt-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
                        <input
                          type="number"
                          placeholder="No limit"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                          className="w-full pl-7 pr-4 py-2 border border-gray-200 rounded-lg focus:border-[#1c5bde] focus:ring-2 focus:ring-[#1c5bde]/20"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickPriceRanges.map((range) => (
                      <button
                        key={range.label}
                        onClick={() => setPriceRange({ min: range.min, max: range.max })}
                        className="px-4 py-2 rounded-lg border border-gray-200 text-sm
                                 hover:border-[#1c5bde] hover:bg-[#1c5bde]/5 hover:text-[#1c5bde] transition-all"
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rooms & Amenities */}
                <div className="space-y-6">
                  {/* Rooms */}
                  <div>
                    <h3 className="font-medium mb-3">Rooms</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm text-gray-600">Bedrooms</label>
                        <div className="mt-2 flex gap-2">
                          {['Any', '1', '2', '3', '4+'].map((num) => (
                            <button
                              key={num}
                              className="min-w-[48px] py-2 rounded-lg border border-gray-200 text-sm
                                       hover:border-[#1c5bde] hover:bg-[#1c5bde]/5 hover:text-[#1c5bde] transition-all"
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Bathrooms</label>
                        <div className="mt-2 flex gap-2">
                          {['Any', '1', '2', '3', '4+'].map((num) => (
                            <button
                              key={num}
                              className="min-w-[48px] py-2 rounded-lg border border-gray-200 text-sm
                                       hover:border-[#1c5bde] hover:bg-[#1c5bde]/5 hover:text-[#1c5bde] transition-all"
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h3 className="font-medium mb-3">Amenities</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {amenities.map((amenity) => (
                        <label
                          key={amenity.label}
                          className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 
                                   hover:border-[#1c5bde] hover:bg-[#1c5bde]/5 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            className="rounded text-[#1c5bde] focus:ring-[#1c5bde]"
                          />
                          <div className="flex items-center gap-2">
                            <amenity.icon className="w-4 h-4 text-gray-400 group-hover:text-[#1c5bde]" />
                            <span className="text-sm text-gray-600 group-hover:text-[#1c5bde]">
                              {amenity.label}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-100">
              <button
                onClick={() => {
                  // Clear filters logic
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                Clear all
              </button>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-200 rounded-full hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Apply filters logic
                    onClose();
                  }}
                  className="px-6 py-2 bg-[#1c5bde] text-white rounded-full hover:bg-[#1c5bde]/90 transition-colors"
                >
                  Show Results
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default SearchInterface; 