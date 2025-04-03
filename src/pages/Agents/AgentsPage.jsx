import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Users, Star, Building, Search, MapPin, Filter, ChevronDown } from 'lucide-react';

const AgentsPage = () => {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Agents</h1>
          <p className="text-gray-600">Connect with top real estate agents in Gombe</p>
          
          {/* Search and Filter Bar */}
          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search agents by name or location..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c5bde]/20"
              />
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-50">
                <MapPin className="w-4 h-4" />
                <span>Location</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-8 flex gap-6 border-b">
            <Link 
              to="/agents"
              className="px-4 py-2 text-[#1c5bde] border-b-2 border-[#1c5bde] font-medium"
            >
              All Agents
            </Link>
            <Link 
              to="/agents/top"
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Top Agents
            </Link>
            <Link 
              to="/agents/verified"
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Verified Agents
            </Link>
            <Link 
              to="/agents/agencies"
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Agencies
            </Link>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AgentsPage; 