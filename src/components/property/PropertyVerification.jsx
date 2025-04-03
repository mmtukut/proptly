import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const PropertyVerification = () => {
  const { userRole } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userRole !== 'admin') {
      toast.error('Unauthorized access');
      return;
    }
    loadPendingProperties();
  }, [userRole]);

  const loadPendingProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          profiles:agency_id (
            full_name,
            email
          )
        `)
        .eq('status', 'pending_verification')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (propertyId, status, rejectionReason = '') => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ 
          status: status,
          rejection_reason: rejectionReason,
          verified_at: status === 'verified' ? new Date().toISOString() : null
        })
        .eq('id', propertyId);

      if (error) throw error;

      // Update local state
      setProperties(properties.filter(p => p.id !== propertyId));
      toast.success(`Property ${status === 'verified' ? 'verified' : 'rejected'} successfully`);
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Failed to update property status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Property Verification</h1>
            <p className="text-gray-600">Review and verify property listings</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {properties.length} pending verification{properties.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties to Verify</h3>
            <p className="text-gray-600">All properties have been reviewed</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Agent</p>
                        <p className="font-medium">{property.profiles.full_name}</p>
                        <p className="text-sm text-gray-500">{property.profiles.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium">{property.location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="font-medium">${property.price.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Property Type</p>
                        <p className="font-medium capitalize">{property.type}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">Description</p>
                      <p className="text-gray-700">{property.description}</p>
                    </div>
                    {property.images && property.images.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Property Images</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {property.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Property ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    <button
                      onClick={() => handleVerification(property.id, 'verified')}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Verify
                    </button>
                    <button
                      onClick={() => {
                        const reason = window.prompt('Please provide a reason for rejection:');
                        if (reason) {
                          handleVerification(property.id, 'rejected', reason);
                        }
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyVerification;
