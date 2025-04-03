import { supabase } from '../config/supabase';
import { compressImage } from '../utils/imageCompression';
import { notificationService } from './notificationService';

export const propertyManagementService = {
  // Create a new property with draft status
  createProperty: async (propertyData, images) => {
    try {
      // First, create the property record
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert({
          ...propertyData,
          status: 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          verification_status: 'pending',
          views: 0,
          inquiries: 0
        })
        .select()
        .single();

      if (propertyError) throw propertyError;

      // Upload images if provided
      if (images && images.length > 0) {
        const imageUrls = await Promise.all(
          images.map(async (image) => {
            const compressedImage = await compressImage(image);
            const fileName = `${property.id}/${Date.now()}-${image.name}`;
            const { data: uploadData, error: uploadError } = await supabase
              .storage
              .from('property-images')
              .upload(fileName, compressedImage);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase
              .storage
              .from('property-images')
              .getPublicUrl(fileName);

            return publicUrl;
          })
        );

        // Update property with image URLs
        const { error: updateError } = await supabase
          .from('properties')
          .update({ images: imageUrls })
          .eq('id', property.id);

        if (updateError) throw updateError;
      }

      return property.id;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  },

  // Update an existing property
  updateProperty: async (propertyId, updates) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', propertyId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  },

  // Submit property for verification
  submitForVerification: async (propertyId) => {
    try {
      // Get property data
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (propertyError) throw propertyError;

      // Check required fields
      const requiredFields = ['title', 'description', 'price', 'location', 'type'];
      const missingFields = requiredFields.filter(field => !property[field]);

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Update verification status
      const { error: updateError } = await supabase
        .from('properties')
        .update({
          verification_status: 'pending',
          verification_submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', propertyId);

      if (updateError) throw updateError;

      // Get admin users
      const { data: admins, error: adminsError } = await supabase
        .from('users')
        .select('id')
        .in('role', ['admin', 'super_admin']);

      if (adminsError) throw adminsError;

      // Create notifications for admins
      const notificationPromises = admins.map(admin =>
        notificationService.sendNotification({
          userId: admin.id,
          type: 'new_property_verification',
          title: 'New Property Verification Request',
          message: `A new property "${property.title}" needs verification.`,
          data: {
            propertyId,
            propertyTitle: property.title
          }
        })
      );

      await Promise.all(notificationPromises);

      return true;
    } catch (error) {
      console.error('Error submitting property for verification:', error);
      throw error;
    }
  },

  // Verify a property
  verifyProperty: async (propertyId, verificationData, verifierInfo) => {
    try {
      // Get property data
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select('user_id')
        .eq('id', propertyId)
        .single();

      if (propertyError) throw propertyError;

      // Create verification history entry
      const { error: historyError } = await supabase
        .from('verification_history')
        .insert({
          property_id: propertyId,
          status: verificationData.status,
          notes: verificationData.notes || '',
          verified_by: {
            userId: verifierInfo.userId,
            name: verifierInfo.name,
            email: verifierInfo.email,
            role: verifierInfo.role
          },
          created_at: new Date().toISOString()
        });

      if (historyError) throw historyError;

      // Update property verification status
      const { error: updateError } = await supabase
        .from('properties')
        .update({
          verification_status: verificationData.status,
          verification_notes: verificationData.notes || '',
          verified_by: verifierInfo,
          verified_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', propertyId);

      if (updateError) throw updateError;

      // Create notification for property owner
      await notificationService.sendNotification({
        userId: property.user_id,
        type: 'PROPERTY_VERIFICATION',
        title: `Property Verification ${verificationData.status === 'VERIFIED' ? 'Approved' : 'Rejected'}`,
        message: verificationData.status === 'VERIFIED'
          ? `Your property has been verified successfully${verificationData.notes ? ': ' + verificationData.notes : ''}`
          : `Your property verification was rejected${verificationData.notes ? ': ' + verificationData.notes : ''}`,
        data: {
          propertyId,
          status: verificationData.status
        }
      });

      return {
        success: true,
        message: `Property ${verificationData.status === 'VERIFIED' ? 'verified' : 'rejected'} successfully`,
        propertyId,
        verificationStatus: verificationData.status
      };
    } catch (error) {
      console.error('Error in verifyProperty:', error);
      throw error;
    }
  },

  // Get properties pending verification with pagination
  getPendingVerifications: async (options = {}) => {
    try {
      const { pageSize = 10, page = 1, filters = {} } = options;

      let query = supabase
        .from('properties')
        .select('*, users!inner(*)', { count: 'exact' })
        .eq('verification_status', 'pending')
        .order('verification_submitted_at', { ascending: true })
        .range((page - 1) * pageSize, page * pageSize - 1);

      // Apply filters
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      if (filters.priceRange) {
        query = query
          .gte('price', filters.priceRange.min)
          .lte('price', filters.priceRange.max);
      }

      const { data, count, error } = await query;

      if (error) throw error;

      return {
        properties: data,
        total: count,
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize)
      };
    } catch (error) {
      console.error('Error getting pending verifications:', error);
      throw error;
    }
  },

  // Get verification history for a property
  getVerificationHistory: async (propertyId) => {
    try {
      const { data, error } = await supabase
        .from('verification_history')
        .select('*')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting verification history:', error);
      throw error;
    }
  },

  // Handle property media upload
  uploadPropertyMedia: async (propertyId, files, type = 'images') => {
    try {
      const mediaUrls = await Promise.all(
        files.map(async (file) => {
          const compressedFile = type === 'images' ? await compressImage(file) : file;
          const fileName = `${propertyId}/${Date.now()}-${file.name}`;
          
          const { error: uploadError } = await supabase
            .storage
            .from(`property-${type}`)
            .upload(fileName, compressedFile);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase
            .storage
            .from(`property-${type}`)
            .getPublicUrl(fileName);

          return publicUrl;
        })
      );

      // Update property with new media URLs
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select(type)
        .eq('id', propertyId)
        .single();

      if (propertyError) throw propertyError;

      const existingMedia = property[type] || [];
      const updatedMedia = [...existingMedia, ...mediaUrls];

      const { error: updateError } = await supabase
        .from('properties')
        .update({ [type]: updatedMedia })
        .eq('id', propertyId);

      if (updateError) throw updateError;

      return mediaUrls;
    } catch (error) {
      console.error('Error uploading property media:', error);
      throw error;
    }
  },

  // Delete property media
  deletePropertyMedia: async (propertyId, mediaUrl) => {
    try {
      // Extract file path from URL
      const urlParts = mediaUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const mediaType = mediaUrl.includes('images') ? 'images' : 'videos';

      // Delete from storage
      const { error: deleteError } = await supabase
        .storage
        .from(`property-${mediaType}`)
        .remove([`${propertyId}/${fileName}`]);

      if (deleteError) throw deleteError;

      // Update property record
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select(mediaType)
        .eq('id', propertyId)
        .single();

      if (propertyError) throw propertyError;

      const updatedMedia = property[mediaType].filter(url => url !== mediaUrl);

      const { error: updateError } = await supabase
        .from('properties')
        .update({ [mediaType]: updatedMedia })
        .eq('id', propertyId);

      if (updateError) throw updateError;

      return true;
    } catch (error) {
      console.error('Error deleting property media:', error);
      throw error;
    }
  },

  // Track property view
  trackPropertyView: async (propertyId, userId) => {
    try {
      // Record view in analytics table
      const { error: analyticsError } = await supabase
        .from('property_analytics')
        .insert({
          property_id: propertyId,
          user_id: userId,
          action: 'view',
          created_at: new Date().toISOString()
        });

      if (analyticsError) throw analyticsError;

      // Increment view count
      const { error: updateError } = await supabase.rpc('increment_property_views', {
        p_id: propertyId
      });

      if (updateError) throw updateError;

      return true;
    } catch (error) {
      console.error('Error tracking property view:', error);
      throw error;
    }
  },

  // Track property inquiry
  trackPropertyInquiry: async (propertyId, userId, inquiryData) => {
    try {
      // Record inquiry
      const { error: inquiryError } = await supabase
        .from('property_inquiries')
        .insert({
          property_id: propertyId,
          user_id: userId,
          ...inquiryData,
          created_at: new Date().toISOString()
        });

      if (inquiryError) throw inquiryError;

      // Increment inquiry count
      const { error: updateError } = await supabase.rpc('increment_property_inquiries', {
        p_id: propertyId
      });

      if (updateError) throw updateError;

      return true;
    } catch (error) {
      console.error('Error tracking property inquiry:', error);
      throw error;
    }
  },

  // Get property analytics
  getPropertyAnalytics: async (propertyId, dateRange = 'week') => {
    try {
      const { data, error } = await supabase
        .rpc('get_property_analytics', {
          p_id: propertyId,
          time_range: dateRange
        });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error getting property analytics:', error);
      throw error;
    }
  }
};