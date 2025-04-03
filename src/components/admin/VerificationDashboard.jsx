import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerificationDashboard = () => {
  const [pendingVerifications, setPendingVerifications] = useState({
    agents: [],
    properties: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch pending verifications
    const fetchPendingVerifications = async () => {
      try {
        const [agentsRes, propertiesRes] = await Promise.all([
          axios.get('/api/verifications/agents/pending'),
          axios.get('/api/verifications/properties/pending')
        ]);
        setPendingVerifications({
          agents: agentsRes.data,
          properties: propertiesRes.data
        });
      } catch (error) {
        console.error('Error fetching verifications:', error);
      }
    };

    fetchPendingVerifications();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Verification Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Pending Agent Verifications</h2>
          <div className="space-y-4">
            {pendingVerifications.agents.map((agent) => (
              <div key={agent.id} className="border p-4 rounded">
                <h3 className="font-medium">{agent.name}</h3>
                <p className="text-gray-600">{agent.email}</p>
                <button 
                  onClick={() => navigate(`/admin/verify/agent/${agent.id}`)}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Pending Property Verifications</h2>
          <div className="space-y-4">
            {pendingVerifications.properties.map((property) => (
              <div key={property.id} className="border p-4 rounded">
                <h3 className="font-medium">{property.title}</h3>
                <p className="text-gray-600">{property.location}</p>
                <button 
                  onClick={() => navigate(`/admin/verify/property/${property.id}`)}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationDashboard;