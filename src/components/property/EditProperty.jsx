import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { permissionService } from '../../services/permissionService';
import { db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { PERMISSIONS } from '../../utils/constants/roles';
import { Loader2 } from 'lucide-react';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [property, setProperty] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    type: 'sale', // sale or rent
    bedrooms: '',
    bathrooms: '',
    squareFootage: '',
    amenities: [],
    status: 'active'
  });

  useEffect(() => {
    checkPermissionAndLoadProperty();
  }, [id, user]);

  const checkPermissionAndLoadProperty = async () => {
    try {
      const { permissions } = await permissionService.getUserPermissions(user.uid);
      
      if (!permissionService.hasPermission(permissions, PERMISSIONS.MANAGE_PROPERTIES)) {
        toast.error("You don't have permission to edit properties");
        navigate('/properties');
        return;
      }

      await loadProperty();
    } catch (error) {
      console.error('Permission check failed:', error);
      toast.error('Failed to verify permissions');
      navigate('/properties');
    }
  };

  const loadProperty = async () => {
    try {
      setLoading(true);
      const propertyRef = doc(db, 'properties', id);
      const propertyDoc = await getDoc(propertyRef);

      if (!propertyDoc.exists()) {
        toast.error('Property not found');
        navigate('/properties');
        return;
      }

      const propertyData = propertyDoc.data();
      
      // Check if the user has permission to edit this specific property
      if (propertyData.agencyId !== user.uid) {
        toast.error("You don't have permission to edit this property");
        navigate('/properties');
        return;
      }

      setProperty(propertyData);
      setFormData({
        title: propertyData.title || '',
        description: propertyData.description || '',
        price: propertyData.price || '',
        location: propertyData.location || '',
        type: propertyData.type || 'sale',
        bedrooms: propertyData.bedrooms || '',
        bathrooms: propertyData.bathrooms || '',
        squareFootage: propertyData.squareFootage || '',
        amenities: propertyData.amenities || [],
        status: propertyData.status || 'active'
      });
    } catch (error) {
      console.error('Error loading property:', error);
      toast.error('Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenitiesChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      amenities: checked 
        ? [...prev.amenities, value]
        : prev.amenities.filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      // Basic validation
      if (!formData.title || !formData.price || !formData.location) {
        toast.error('Please fill in all required fields');
        return;
      }

      const propertyRef = doc(db, 'properties', id);
      await updateDoc(propertyRef, {
        ...formData,
        updatedAt: new Date(),
        updatedBy: user.uid
      });

      toast.success('Property updated successfully');
      navigate('/properties');
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Failed to update property');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Property</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded h-32"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bathrooms</label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Square Footage</label>
            <input
              type="number"
              name="squareFootage"
              value={formData.squareFootage}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Amenities</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['Parking', 'Pool', 'Garden', 'Security', 'Gym', 'Air Conditioning'].map(amenity => (
              <label key={amenity} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={amenity}
                  checked={formData.amenities.includes(amenity)}
                  onChange={handleAmenitiesChange}
                  className="rounded"
                />
                <span>{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? (
              <span className="flex items-center">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Saving...
              </span>
            ) : 'Save Changes'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/properties')}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProperty;
