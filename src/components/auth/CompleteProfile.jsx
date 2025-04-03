import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';
import { motion } from 'framer-motion';
import { 
  Phone, Building2, Home, Building, 
  Briefcase, User, MapPin, Globe, Camera
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const CompleteProfile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    accountType: '',
    address: '',
    city: '',
    state: '',
    country: '',
    bio: '',
    website: '',
    languages: [],
    specializations: []
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
      return;
    }

    // Pre-fill data if available
    const loadUserData = async () => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        if (error) throw error;

        if (profile) {
          setFormData({
            fullName: profile.full_name || '',
            phone: profile.phone || '',
            accountType: profile.account_type || '',
            address: profile.address || '',
            city: profile.city || '',
            state: profile.state || '',
            country: profile.country || '',
            bio: profile.bio || '',
            website: profile.website || '',
            languages: profile.languages || [],
            specializations: profile.specializations || []
          });
          if (profile.avatar_url) {
            setAvatarPreview(profile.avatar_url);
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile data');
      }
    };

    loadUserData();
  }, [currentUser, navigate]);

  const accountTypes = [
    {
      id: 'personal',
      title: 'Home Seeker',
      description: 'Looking to buy, rent, or invest in properties',
      icon: Home,
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      id: 'agent',
      title: 'Real Estate Agent',
      description: 'Professional real estate agent or property manager',
      icon: Building,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      id: 'developer',
      title: 'Property Developer',
      description: 'Property development and construction company',
      icon: Briefcase,
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('Image size should be less than 2MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return null;

    try {
      // First, check if the avatars bucket exists, if not create it
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets();

      if (bucketsError) throw bucketsError;

      const avatarsBucket = buckets.find(b => b.name === 'avatars');
      
      if (!avatarsBucket) {
        const { error: createBucketError } = await supabase
          .storage
          .createBucket('avatars', {
            public: true,
            fileSizeLimit: '2MB',
            allowedMimeTypes: ['image/*']
          });

        if (createBucketError) throw createBucketError;
      }

      // Upload the avatar
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${currentUser.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.fullName || !formData.phone || !formData.accountType) {
        throw new Error('Please fill in all required fields');
      }

      // Upload avatar if changed
      let avatarUrl = avatarPreview;
      if (avatarFile) {
        avatarUrl = await uploadAvatar();
      }

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          phone: formData.phone,
          account_type: formData.accountType,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          bio: formData.bio,
          website: formData.website,
          languages: formData.languages,
          specializations: formData.specializations,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
          is_profile_complete: true
        })
        .eq('id', currentUser.id);

      if (profileError) throw profileError;

      toast.success('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-xl shadow-lg"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Complete Your Profile
            </h2>
            <p className="mt-2 text-gray-600">
              Tell us more about yourself to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Max file size: 2MB. Supported formats: JPEG, PNG
              </p>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {accountTypes.map((type) => (
                    <div
                      key={type.id}
                      onClick={() => setFormData({ ...formData, accountType: type.id })}
                      className={`p-4 rounded-lg border cursor-pointer transition-all
                        ${formData.accountType === type.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-500'
                        }`}
                    >
                      <div className={`${type.color} p-2 rounded-lg inline-block`}>
                        <type.icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-medium mt-2">{type.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Saving...' : 'Complete Profile'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CompleteProfile; 