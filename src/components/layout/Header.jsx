import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Heart, User, Plus, Map, X, Settings, LogOut, Home, Building, Sparkles, Mic, Sliders, Key, Clock, Layout, TrendingUp, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../../assets/images/logo.png';
import SearchInterface from '../search/SearchInterface';

// ProfileMenu Component
const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-all"
      >
        <div className="p-1 bg-gray-100 rounded-full">
          <User className="w-4 h-4 text-gray-600" />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
          >
            {currentUser ? (
              <>
                <div className="p-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{currentUser.email}</p>
                  <p className="text-xs text-gray-500">Manage your account</p>
                </div>
                <div className="p-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link
                    to="/saved"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <Heart className="w-4 h-4" />
                    Saved Properties
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="p-2">
                <Link
                  to="/signin"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-[#1c5bde] hover:bg-[#1c5bde]/5 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Create account
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main Header Component
const Header = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('properties');
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingLocations, setTrendingLocations] = useState([
    { id: 1, name: 'Victoria Island', searches: '2.5k' },
    { id: 2, name: 'Lekki Phase 1', searches: '1.8k' },
    { id: 3, name: 'Ikoyi', searches: '1.2k' },
  ]);

  // Enhanced scroll handling with throttle
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollState = () => {
      setIsScrolled(window.scrollY > 20);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const mainNavItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/'
    },
    {
      id: 'properties',
      label: 'Properties',
      icon: Building,
      path: '/properties',
      subItems: ['All', 'Buy', 'Rent', 'Shortlet']
    },
    {
      id: 'agents',
      label: 'Agents',
      icon: User,
      path: '/agents'
    }
  ];

  // Add user menu items
  const userMenuItems = [
    {
      label: 'Profile',
      icon: User,
      path: '/profile'
    },
    {
      label: 'Saved Properties',
      icon: Heart,
      path: '/saved'
    },
    {
      label: 'Dashboard',
      icon: Layout,
      path: '/dashboard'
    }
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 hidden md:block
        ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white'}
      `}
    >
      <div className="container mx-auto px-4">
        <div className="h-20 flex items-center gap-8">
          <Link to="/" className="shrink-0 transition-transform hover:scale-105">
            <img src={Logo} alt="FastFind" className="h-8" />
          </Link>

          {/* Enhanced SearchInterface with Nudge principles */}
          <div className="flex-1 max-w-3xl">
            <div className="relative group">
              {/* Ambient Animation Background */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#1c5bde]/20 via-[#6366f1]/20 to-[#f43f5e]/20 
                            rounded-full opacity-0 group-hover:opacity-100 blur transition duration-500" />
              
              {/* Main Search Button with Social Proof */}
              <button
                onClick={() => setIsSearchExpanded(true)}
                className="relative w-full flex items-center gap-3 px-6 py-3.5 bg-white rounded-full 
                         border border-gray-200 hover:border-[#1c5bde] hover:shadow-lg transition-all group"
              >
                {/* Enhanced AI Assistant Icon */}
                <div className="relative">
                  <div className="p-2 bg-[#1c5bde]/10 rounded-full">
                    <Sparkles className="h-5 w-5 text-[#1c5bde]" />
                  </div>
                  <div className="absolute inset-0 animate-ping bg-[#1c5bde]/20 rounded-full opacity-25" />
                </div>

                {/* Search Text with Microcopy */}
                <div className="flex-1 text-left">
                  <p className="text-sm text-gray-900 font-medium">Find your perfect place</p>
                  <p className="text-xs text-gray-500">Try "3 bedroom apartment in Lekki Phase 1"</p>
                </div>

                {/* Action Buttons with Labels */}
                <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                  <div className="flex flex-col items-center gap-1">
                    <Mic className="h-4 w-4 text-[#1c5bde]" />
                    <span className="text-[10px] text-gray-500">Voice</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Sliders className="h-4 w-4 text-[#1c5bde]" />
                    <span className="text-[10px] text-gray-500">Filters</span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Navigation with Visual Hierarchy */}
          <nav className="flex items-center gap-6">
            {mainNavItems.map((item) => (
              <div key={item.id} className="relative group">
                <Link
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-full
                    transition-all duration-200 hover:bg-[#1c5bde]/5
                    ${location.pathname === item.path 
                      ? 'text-[#1c5bde] bg-[#1c5bde]/5' 
                      : 'text-gray-600 hover:text-[#1c5bde]'}
                  `}>
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {item.subItems && (
                    <motion.div
                      className="w-2 h-2 bg-[#1c5bde] rounded-full ml-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: location.pathname === item.path ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
                
                {item.subItems && (
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible
                                group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-48">
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem}
                          onClick={() => setActiveSection(subItem.toLowerCase())}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 
                                   hover:text-[#1c5bde] hover:bg-[#1c5bde]/5 transition-colors"
                        >
                          {subItem === 'Trending' && <TrendingUp className="w-4 h-4" />}
                          {subItem === 'Featured' && <Star className="w-4 h-4" />}
                          {subItem}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Quick Actions with Enhanced Feedback */}
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <Link
                to="/map" 
                className="group p-2.5 text-gray-700 hover:bg-[#1c5bde]/5 rounded-full transition-all"
                title="View Map"
              >
                <Map className="w-5 h-5 group-hover:text-[#1c5bde] transition-colors" />
              </Link>
              
              {currentUser && (
                <Link
                  to="/saved"
                  className="group relative p-2.5 text-gray-700 hover:bg-[#1c5bde]/5 rounded-full transition-all"
                  title="Saved Properties"
                >
                  <Heart className="w-5 h-5 group-hover:text-[#1c5bde] transition-colors" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#f43f5e] text-white text-[10px] 
                                 font-medium flex items-center justify-center rounded-full">2</span>
                </Link>
              )}

              <ProfileMenu />
            </div>
          </nav>
        </div>
      </div>

      {/* Expanded Search Interface */}
      <AnimatePresence>
        {isSearchExpanded && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute inset-x-0 top-0 bg-white shadow-xl border-b border-gray-200 z-50"
            >
              <div className="container mx-auto py-6">
                <div className="relative">
                  {/* Close button */}
                  <button
                    onClick={() => setIsSearchExpanded(false)}
                    className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>

                  <SearchInterface 
                    enhancedView={true}
                    showTrending={true}
                    variant="header"
                    categories={[
                      { id: 'all', label: 'All Properties', icon: Building },
                      { id: 'buy', label: 'Buy', icon: Home },
                      { id: 'rent', label: 'Rent', icon: Key },
                      { id: 'shortlet', label: 'Shortlet', icon: Clock }
                    ]}
                    onSearch={(query, filters) => {
                      // Handle search
                      setIsSearchExpanded(false);
                    }}
                    onClose={() => setIsSearchExpanded(false)}
                  />
                </div>
              </div>
            </motion.div>

            {/* Backdrop with blur effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setIsSearchExpanded(false)}
            />
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;