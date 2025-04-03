import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Heart, Trash2, MapPin, Home, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SavedProperties = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedProperties();
  }, [currentUser]);

  const loadSavedProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_properties')
        .select(`
          *,
          property:properties (
            id,
            title,
            price,
            address,
            city,
            state,
            country,
            images,
            property_type,
            bedrooms,
            bathrooms,
            area
          )
        `)
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSavedProperties(data.filter(item => item.property !== null));
    } catch (error) {
      console.error('Error loading saved properties:', error);
      toast.error('Failed to load saved properties');
    } finally {
      setLoading(false);
    }
  };

  const removeSavedProperty = async (propertyId) => {
    try {
      const { error } = await supabase
        .from('saved_properties')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('property_id', propertyId);

      if (error) throw error;

      setSavedProperties(prev => prev.filter(item => item.property_id !== propertyId));
      toast.success('Property removed from saved list');
    } catch (error) {
      console.error('Error removing saved property:', error);
      toast.error('Failed to remove property');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (savedProperties.length === 0) {
    return (
      <div className="text-center py-12 pt-20">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No saved properties</h3>
        <p className="text-gray-500 mb-6">You haven't saved any properties yet.</p>
        <button
          onClick={() => navigate('/properties')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Browse Properties
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {savedProperties.map(({ property }) => (
          <div
            key={property.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={property.images?.[0] || '/placeholder-property.jpg'}
                  alt={property.title}
                  className="object-cover rounded-t-lg w-full h-full"
                />
              </div>
              <button
                onClick={() => removeSavedProperty(property.id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {property.property_type}
                </span>
                <span className="text-lg font-bold text-blue-600">
                  {formatPrice(property.price)}
                </span>
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-2">
                <button
                  onClick={() => navigate(`/properties/${property.id}`)}
                  className="hover:text-blue-600"
                >
                  {property.title}
                </button>
              </h3>

              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>
                    {[property.address, property.city, property.state, property.country]
                      .filter(Boolean)
                      .join(', ')}
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Home className="w-4 h-4 mr-1" />
                    <span>{property.bedrooms} bd</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span>{property.bathrooms} ba</span>
                  </div>
                  <div>
                    <span>{property.area} sqft</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedProperties; 