import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { propertyManagementService } from '../../services/propertyManagement';
import { ImageUpload } from '../common/ImageUpload';
import { MapPicker } from '../map/MapPicker';
import { toast } from 'react-toastify';

const AddProperty = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState({ lat: 0, lng: 0 });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'residential',
    size: '',
    bedrooms: '',
    bathrooms: '',
    features: [],
    address: '',
    location: ''
  });

  const propertyTypes = [
    { id: 'residential', label: 'Residential' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'industrial', label: 'Industrial' },
    { id: 'land', label: 'Land' }
  ];

  const features = [
    'Parking',
    'Swimming Pool',
    'Garden',
    'Security',
    'Gym',
    'Air Conditioning',
    'Furnished'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleLocationSelect = (coordinates, address) => {
    setLocation(coordinates);
    setFormData(prev => ({
      ...prev,
      location: address,
      coordinates: coordinates
    }));
  };

  const handleImageUpload = (uploadedImages) => {
    setImages(uploadedImages);
  };

  const validateForm = () => {
    const requiredFields = ['title', 'price', 'type', 'location'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in: ${missingFields.join(', ')}`);
      return false;
    }
    
    if (images.length === 0) {
      setError('Please upload at least one image');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      setLoading(true);
      const propertyData = {
        ...formData,
        images,
        coordinates: location,
        agency_id: user.id,
        status: 'pending_verification', // Add verification status
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Submit property for verification
      const response = await propertyManagementService.createProperty(propertyData);
      
      // Create verification request
      await propertyManagementService.createVerificationRequest({
        property_id: response.data.id,
        agent_id: user.id,
        status: 'pending',
        submission_date: new Date().toISOString()
      });

      setLoading(false);
      toast.success('Property submitted for verification');
      navigate('/manage-properties');
    } catch (error) {
      setLoading(false);
      setError(error.message || 'Failed to add property');
      toast.error('Failed to add property');
    }
  };

  const handleSaveDraft = async () => {
    if (!user) {
      console.error('User is not authenticated');
      return; 
    }
    try {
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        size: parseFloat(formData.size),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        userId: user.uid,
        coordinates: location,
        status: 'draft'
      };
      await propertyManagementService.createProperty(propertyData, images);
      navigate('/properties/manage/dashboard');
    } catch (err) {
      console.error('Error saving draft:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Add New Property</h1>
            <p className="text-gray-600">Fill in the details below. Your property will be reviewed before being listed.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  >
                    {propertyTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Size (sq ft)</label>
                  <input
                    type="number"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {features.map(feature => (
                  <label key={feature} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span>{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <MapPicker onLocationSelect={handleLocationSelect} />
              <input
                type="text"
                name="address"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter address manually"
                className="mt-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            {/* Images */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Images</h2>
              <ImageUpload onImagesSelected={handleImageUpload} />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Property'}
              </button>
              <button
                onClick={handleSaveDraft}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
              >
                Save as Draft
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
