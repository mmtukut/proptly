import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';
import { toast } from 'react-hot-toast';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Square,
  Loader2
} from 'lucide-react';

const ManageProperties = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, sale, rent

  useEffect(() => {
    loadProperties();
  }, [user]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const { data: propertiesData, error } = await supabase
        .from('properties')
        .select('*')
        .eq('agency_id', user.id);

      if (error) throw error;
      
      setProperties(propertiesData || []);
    } catch (error) {
      console.error('Error loading properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;

      setProperties(properties.filter(property => property.id !== propertyId));
      toast.success('Property deleted successfully');
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property');
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || property.type === filter;
    return matchesSearch && matchesFilter;
  });

  const statusBadge = (status) => {
    const statusConfig = {
      pending_verification: {
        color: 'bg-yellow-100 text-yellow-800',
        label: 'Pending Verification'
      },
      verified: {
        color: 'bg-green-100 text-green-800',
        label: 'Verified'
      },
      rejected: {
        color: 'bg-red-100 text-red-800',
        label: 'Rejected'
      }
    };

    const config = statusConfig[status] || {
      color: 'bg-gray-100 text-gray-800',
      label: status
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#1c5bde]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Properties</h1>
            <p className="text-gray-600">View and manage your property listings</p>
          </div>
          <Link
            to="/add-property"
            className="inline-flex items-center px-4 py-2 bg-[#1c5bde] text-white rounded-lg hover:bg-[#1c5bde]/90 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Property
          </Link>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c5bde] focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c5bde] focus:border-transparent"
            >
              <option value="all">All Properties</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Property List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredProperties.map(property => (
          <div key={property.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-64 h-48 md:h-auto relative">
                {property.images?.[0] ? (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Building2 className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{property.title}</h2>
                    <p className="text-gray-600 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusBadge(property.status)}
                    <div className="flex gap-1">
                      <button
                        onClick={() => navigate(`/properties/${property.id}`)}
                        className="p-2 text-gray-600 hover:text-[#1c5bde] transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => navigate(`/properties/${property.id}/edit`)}
                        className="p-2 text-gray-600 hover:text-[#1c5bde] transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProperty(property.id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-5 h-5 mr-2" />
                    <span>{property.price?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Bed className="w-5 h-5 mr-2" />
                    <span>{property.bedrooms} Beds</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Bath className="w-5 h-5 mr-2" />
                    <span>{property.bathrooms} Baths</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Square className="w-5 h-5 mr-2" />
                    <span>{property.size} sqft</span>
                  </div>
                </div>
                {property.status === 'rejected' && property.rejection_reason && (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-800">
                      <strong>Rejection Reason:</strong> {property.rejection_reason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600">
              {searchTerm || filter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Add your first property to get started'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProperties;
