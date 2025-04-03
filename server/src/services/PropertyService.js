// src/services/PropertyService.js
const supabase = require('../database');

class PropertyService {
  async getAllProperties() {
    const { data, error } = await supabase
      .from('properties')
      .select('*');
    
    if (error) throw error;
    return data;
  }

  async getPropertyById(id) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async filterProperties(filters) {
    try {
      console.log('Received filters:', filters);
      let query = supabase
        .from('properties')
        .select('*');

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters.maxPrice) {
        // Convert price string to number
        let priceValue = filters.maxPrice;
        
        // Remove currency symbol and other non-numeric characters
        priceValue = priceValue.replace(/[₦NGN,]/gi, '');
        
        // Handle "million" in the price
        if (priceValue.toLowerCase().includes('million')) {
          priceValue = parseFloat(priceValue) * 1000000;
        } else if (priceValue.toLowerCase().includes('m')) {
          priceValue = parseFloat(priceValue) * 1000000;
        } else {
          priceValue = parseFloat(priceValue);
        }

        // Only apply filter if we got a valid number
        if (!isNaN(priceValue)) {
          console.log('Applying price filter:', priceValue);
          query = query.lte('price', priceValue);
        }
      }

      if (filters.propertyType) {
        query = query.ilike('type', `%${filters.propertyType}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      console.log(`Found ${data?.length || 0} properties matching filters`);
      return data || [];
    } catch (error) {
      console.error('Error in filterProperties:', error);
      throw error;
    }
  }

  async createProperty(property) {
    const { data, error } = await supabase
      .from('properties')
      .insert([property])
      .select();
    
    if (error) throw error;
    return data;
  }

  async updateProperty(id, property) {
    const { data, error } = await supabase
      .from('properties')
      .update(property)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data;
  }

  async deleteProperty(id) {
    const { data, error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data;
  }
}

module.exports = new PropertyService();
