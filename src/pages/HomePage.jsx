import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Building, TrendingUp, Home, BedDouble, Bath, Square, ArrowRight, X, Filter, ChevronDown, Currency, Heart, Users, Clock, Eye, Shield, Star, Sparkles, Zap } from 'lucide-react';
import { Card } from '../components/ui/card';
import PropertyCard from '../components/cards/PropertyCard';
import { properties } from '../data/properties.data';
import SearchInterface from '../components/search/SearchInterface';
import heroImage from '../assets/images/hero.jpg';

const HomePage = () => {
  const navigate = useNavigate();
  const [activeProperties, setActiveProperties] = useState([]);
  const [viewerCount, setViewerCount] = useState(0);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [trendingLocations, setTrendingLocations] = useState([]);

  useEffect(() => {
    // Simulate real-time data
    setViewerCount(Math.floor(Math.random() * 50) + 100);
    setActiveProperties(properties.slice(0, 6));
    setRecentlyViewed(properties.slice(6, 9));
    setTrendingLocations([
      { name: 'Maitama', count: '2,345 properties', growth: '+15%' },
      { name: 'Asokoro', count: '1,892 properties', growth: '+12%' },
      { name: 'Central Business District (CBD)', count: '1,234 properties', growth: '+10%' }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Social Proof */}
      <section className="relative h-[85vh] bg-cover bg-center">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url(${heroImage})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Find Your Dream Home
            </h1>
            <p className="text-xl text-white/90 mb-4 max-w-2xl mx-auto">
              Join {viewerCount.toLocaleString()}+ active home seekers finding their perfect match
            </p>
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="text-white text-center">
                <Users className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm">50k+ Happy Customers</p>
              </div>
              <div className="text-white text-center">
                <Shield className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm">Verified Properties</p>
              </div>
              <div className="text-white text-center">
                <Star className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm">4.8/5 Rating</p>
              </div>
            </div>
          </div>
          
          <div className="w-full max-w-4xl">
            <SearchInterface className="shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Properties</h2>
              <p className="text-gray-600">Handpicked properties you'll love</p>
            </div>
            <Link 
              to="/properties"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Properties
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Locations */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Trending Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingLocations.map((location, index) => (
              <Link
                key={index}
                to={`/properties?location=${location.name}`}
                className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                    {location.name}
                  </h3>
                  <span className="text-green-500 text-sm font-medium">
                    {location.growth}
                  </span>
                </div>
                <p className="text-gray-600">{location.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Recently Viewed</h2>
                <p className="text-gray-600">Continue your property search</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentlyViewed.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect home through our platform
          </p>
          <button
            onClick={() => navigate('/properties')}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Your Search Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
