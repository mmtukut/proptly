import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Search, 
  MapPin, 
  Heart, 
  User, 
  Plus, 
  ArrowLeft, 
  X,
  Building2,
  Key,
  Clock,
  Store,
  TreePine, 
  Coins,
  BedDouble,
  Map,
  TrendingUp,
  Star,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../../assets/images/logo.png';
import SearchInterface from '../search/SearchInterface';

const MobileNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [savedCount, setSavedCount] = useState(2); // Default to show social proof
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isPropertiesPage = location.pathname === '/properties';
  const isMapView = location.pathname === '/map';

  // Enhanced categories with visual hierarchy
  const enhancedCategories = [
    { 
      id: 'trending', 
      label: 'Trending', 
      icon: TrendingUp,
      highlight: true 
    },
    { 
      id: 'residential', 
      label: 'Residential', 
      icon: Building2, 
      subcategories: ['Apartment', 'House', 'Duplex', 'Self Contain', 'Single Room'],
      popular: true
    },
    { 
      id: 'commercial', 
      label: 'Commercial', 
      icon: Store, 
      subcategories: ['Office Space', 'Shop', 'Warehouse', 'Plaza']
    },
    { 
      id: 'shortlet', 
      label: 'Short Stay', 
      icon: Clock, 
      subcategories: ['Apartment', 'House', 'Room'],
      new: true
    },
    { 
      id: 'land', 
      label: 'Land & Plots', 
      icon: TreePine 
    }
  ];

  // Enhanced nav items with visual feedback
  const navItems = [
    { 
      path: '/', 
      icon: Home, 
      label: 'Home',
      activeIcon: () => <Home className="w-6 h-6 fill-current" />
    },
    { 
      path: '/properties', 
      icon: Search, 
      label: 'Explore',
      activeIcon: () => <Search className="w-6 h-6 fill-current" />,
      highlight: true
    },
    { 
      path: '/map',
      icon: Map, 
      label: 'Map',
      activeIcon: () => <Map className="w-6 h-6 fill-current" />
    },
    { 
      path: '/saved',
      icon: Heart, 
      label: 'Saved',
      requiresAuth: true,
      badge: savedCount,
      activeIcon: () => <Heart className="w-6 h-6 fill-current" />
    },
    { 
      path: currentUser ? '/profile' : '/signin', 
      icon: User, 
      label: currentUser ? 'Profile' : 'Sign In',
      activeIcon: () => <User className="w-6 h-6 fill-current" />
    }
  ];

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(lastScrollY > currentScrollY || currentScrollY < 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Show back button for inner pages
  const showBackButton = location.pathname !== '/';

  // Handle search results
  const handleSearch = (searchData) => {
    setIsSearchOpen(false);
    navigate('/properties', { state: { searchData } });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 md:hidden"
        >
          {/* Quick Search Bar */}
          <div className="px-4 py-3 border-b border-gray-100">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-50 hover:bg-gray-100
                       text-left rounded-xl border border-gray-200 transition-all"
            >
              <div className="relative">
                <div className="p-1.5 bg-[#1c5bde]/10 rounded-full">
                  <Sparkles className="h-4 w-4 text-[#1c5bde]" />
                </div>
              </div>
              <span className="text-sm text-gray-500">Find your perfect place...</span>
            </button>
          </div>

          {/* Enhanced Navigation */}
          <nav className="flex items-center justify-around px-2 py-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex flex-col items-center gap-1 p-3 rounded-xl transition-all
                    ${isActive ? 'text-[#1c5bde]' : 'text-gray-500'}
                    ${item.highlight ? 'scale-110' : ''}
                  `}
                >
                  <div className="relative">
                    {isActive ? item.activeIcon() : <item.icon className="w-6 h-6" />}
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#f43f5e] text-white 
                                     text-[10px] font-medium flex items-center justify-center rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium">{item.label}</span>
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 w-12 h-1 bg-[#1c5bde] rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Enhanced Search Interface */}
          <AnimatePresence>
            {isSearchOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: "100%" }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: "100%" }}
                  transition={{ type: "spring", bounce: 0 }}
                  className="fixed inset-0 bg-white z-50"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-4 p-4 border-b border-gray-200">
                      <button
                        onClick={() => setIsSearchOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <h2 className="text-lg font-semibold">Search Properties</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                      <SearchInterface
                        enhancedView={true}
                        showTrending={true}
                        variant="mobile"
                        onClose={() => setIsSearchOpen(false)}
                        categories={enhancedCategories}
                      />
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;