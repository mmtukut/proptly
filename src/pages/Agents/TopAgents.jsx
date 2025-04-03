import React from 'react';
import AgentCard from '../../components/cards/AgentCard';
import { agentsData } from '../../data/agentsData';
import { Trophy } from 'lucide-react';

const TopAgents = () => {
  const topAgents = agentsData.filter(agent => agent.isTopAgent);

  return (
    <div>
      {/* Top Agents Header */}
      <div className="bg-gradient-to-r from-[#1c5bde]/10 to-transparent p-6 rounded-xl mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#1c5bde] rounded-xl">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Top Performing Agents</h2>
            <p className="text-gray-600">Our highest-rated and most successful agents</p>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topAgents.map(agent => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
};

export default TopAgents; 