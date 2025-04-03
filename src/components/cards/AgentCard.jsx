import React from 'react';
import { Star, MapPin, Phone, MessageSquare, Shield, Building } from 'lucide-react';
import { Link } from 'react-router-dom';

const AgentCard = ({ agent }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-[#1c5bde]/20 hover:shadow-lg transition-all duration-300">
      <div className="p-6">
        {/* Agent Header */}
        <div className="flex items-start gap-4">
          <img
            src={agent.image}
            alt={agent.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#1c5bde]/20"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{agent.name}</h3>
              {agent.verified && (
                <Shield className="w-4 h-4 text-[#1c5bde]" />
              )}
            </div>
            <p className="text-gray-600 text-sm">{agent.agency}</p>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{agent.location}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-medium">{agent.rating}</span>
            </div>
            <span className="text-sm text-gray-500">{agent.reviews} reviews</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-gray-600">Properties</p>
            <p className="font-semibold text-gray-900">{agent.properties}</p>
          </div>
          <div className="text-center border-x border-gray-200">
            <p className="text-sm text-gray-600">Experience</p>
            <p className="font-semibold text-gray-900">{agent.experience} yrs</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Deals</p>
            <p className="font-semibold text-gray-900">{agent.deals}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#1c5bde] text-white rounded-lg hover:bg-[#1c5bde]/90">
            <Phone className="w-4 h-4" />
            <span>Call</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <MessageSquare className="w-4 h-4" />
            <span>Message</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentCard; 