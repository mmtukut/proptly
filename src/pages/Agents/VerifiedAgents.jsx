import React from 'react';
import AgentCard from '../../components/cards/AgentCard';
import { agentsData } from '../../data/agentsData';
import { Shield } from 'lucide-react';

const VerifiedAgents = () => {
  const verifiedAgents = agentsData.filter(agent => agent.verified);

  return (
    <div>
      {/* Verified Agents Header */}
      <div className="bg-gradient-to-r from-green-100 to-transparent p-6 rounded-xl mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-500 rounded-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Verified Agents</h2>
            <p className="text-gray-600">Trusted and verified real estate professionals</p>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {verifiedAgents.map(agent => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
};

export default VerifiedAgents; 