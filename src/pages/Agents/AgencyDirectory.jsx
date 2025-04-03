import React from 'react';
import { agenciesData } from '../../data/agentsData';
import { Building, MapPin, Users, Home, Star, Shield, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const AgencyCard = ({ agency }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-[#1c5bde]/20 hover:shadow-lg transition-all duration-300">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
            <Building className="w-8 h-8 text-[#1c5bde]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{agency.name}</h3>
              {agency.verified && (
                <Shield className="w-4 h-4 text-green-500" />
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{agency.location}</span>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{agency.agents} Agents</span>
              </div>
              <div className="flex items-center gap-1">
                <Home className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{agency.properties} Properties</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-medium">{agency.rating}</span>
            </div>
            <span className="text-sm text-gray-500">{agency.reviews} reviews</span>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Link 
            to={`/agencies/${agency.id}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#1c5bde] text-white rounded-lg hover:bg-[#1c5bde]/90"
          >
            View Profile
          </Link>
          <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const AgencyDirectory = () => {
  return (
    <div>
      {/* Agency Directory Header */}
      <div className="bg-gradient-to-r from-[#1c5bde]/10 to-transparent p-6 rounded-xl mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#1c5bde] rounded-xl">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Agency Directory</h2>
            <p className="text-gray-600">Browse through our trusted real estate agencies</p>
          </div>
        </div>
      </div>

      {/* Agencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agenciesData.map(agency => (
          <AgencyCard key={agency.id} agency={agency} />
        ))}
      </div>
    </div>
  );
};

export default AgencyDirectory; 