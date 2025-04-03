import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const PropertyVerificationForm = ({ propertyId, onVerificationComplete }) => {
  const [formData, setFormData] = useState({
    propertyTitle: '',
    ownershipDocuments: null,
    propertyPhotos: [],
    propertyInspectionReport: null,
    taxDocuments: null,
    verificationNotes: '',
    propertyStatus: 'pending' // pending, verified, rejected
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'propertyPhotos') {
      setFormData(prev => ({
        ...prev,
        [name]: [...prev.propertyPhotos, ...files]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'propertyPhotos') {
          formData[key].forEach(file => {
            formDataToSend.append('propertyPhotos', file);
          });
        } else if (formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      await axios.post(`/api/verifications/properties/${propertyId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Property verification documents submitted successfully');
      if (onVerificationComplete) {
        onVerificationComplete();
      }
    } catch (error) {
      console.error('Error submitting property verification:', error);
      toast.error('Failed to submit property verification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Property Verification Form</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Property Title
          </label>
          <input
            type="text"
            name="propertyTitle"
            value={formData.propertyTitle}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ownership Documents
          </label>
          <input
            type="file"
            name="ownershipDocuments"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Property Photos
          </label>
          <input
            type="file"
            name="propertyPhotos"
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Please upload clear photos of all areas of the property
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Property Inspection Report
          </label>
          <input
            type="file"
            name="propertyInspectionReport"
            onChange={handleFileChange}
            accept=".pdf"
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tax Documents
          </label>
          <input
            type="file"
            name="taxDocuments"
            onChange={handleFileChange}
            accept=".pdf"
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Property Status
          </label>
          <select
            name="propertyStatus"
            value={formData.propertyStatus}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Verification Notes
          </label>
          <textarea
            name="verificationNotes"
            value={formData.verificationNotes}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Add any additional notes or observations about the property verification"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Submitting...' : 'Submit Verification'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyVerificationForm;
