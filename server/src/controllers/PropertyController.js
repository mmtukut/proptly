// src/controllers/PropertyController.js
const supabase = require('../database');

class PropertyController {
  static async getAllProperties(req, res) {
    try {
      const { data: properties, error } = await supabase
        .from('properties')
        .select(`
          *,
          agent:agents(
            id,
            user_id,
            specialization
          ),
          agency:agencies(
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json(properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      res.status(500).json({
        error: 'Database error',
        message: error.message
      });
    }
  }

  static async getPropertyById(req, res) {
    try {
      const { id } = req.params;
      const { data: property, error } = await supabase
        .from('properties')
        .select(`
          *,
          agent:agents(
            id,
            user_id,
            specialization
          ),
          agency:agencies(
            id,
            name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!property) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Property not found'
        });
      }

      res.json(property);
    } catch (error) {
      console.error('Error fetching property:', error);
      res.status(500).json({
        error: 'Database error',
        message: error.message
      });
    }
  }

  static async createProperty(req, res) {
    try {
      const {
        title,
        description,
        price,
        location,
        address,
        type,
        status = 'available',
        bedrooms,
        bathrooms,
        area,
        features,
        images,
        agent_id,
        agency_id
      } = req.body;

      // Validate required fields
      if (!title || !price || !location || !address || !type) {
        return res.status(400).json({
          error: 'Missing fields',
          message: 'Title, price, location, address, and type are required'
        });
      }

      const { data: property, error } = await supabase
        .from('properties')
        .insert([{
          title,
          description,
          price,
          location,
          address,
          type,
          status,
          bedrooms,
          bathrooms,
          area,
          features,
          images,
          agent_id,
          agency_id
        }])
        .select()
        .single();

      if (error) throw error;

      res.status(201).json(property);
    } catch (error) {
      console.error('Error creating property:', error);
      res.status(500).json({
        error: 'Database error',
        message: error.message
      });
    }
  }

  static async updateProperty(req, res) {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        price,
        location,
        address,
        type,
        status,
        bedrooms,
        bathrooms,
        area,
        features,
        images,
        agent_id,
        agency_id
      } = req.body;

      const { data: property, error } = await supabase
        .from('properties')
        .update({
          title,
          description,
          price,
          location,
          address,
          type,
          status,
          bedrooms,
          bathrooms,
          area,
          features,
          images,
          agent_id,
          agency_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (!property) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Property not found'
        });
      }

      res.json(property);
    } catch (error) {
      console.error('Error updating property:', error);
      res.status(500).json({
        error: 'Database error',
        message: error.message
      });
    }
  }

  static async deleteProperty(req, res) {
    try {
      const { id } = req.params;
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      res.json({
        message: 'Property deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting property:', error);
      res.status(500).json({
        error: 'Database error',
        message: error.message
      });
    }
  }

  static async getPropertiesByAgent(req, res) {
    try {
      const { agentId } = req.params;
      const { data: properties, error } = await supabase
        .from('properties')
        .select(`
          *,
          agent:agents(
            id,
            user_id,
            specialization
          ),
          agency:agencies(
            id,
            name
          )
        `)
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json(properties);
    } catch (error) {
      console.error('Error fetching agent properties:', error);
      res.status(500).json({
        error: 'Database error',
        message: error.message
      });
    }
  }

  static async getPropertiesByAgency(req, res) {
    try {
      const { agencyId } = req.params;
      const { data: properties, error } = await supabase
        .from('properties')
        .select(`
          *,
          agent:agents(
            id,
            user_id,
            specialization
          ),
          agency:agencies(
            id,
            name
          )
        `)
        .eq('agency_id', agencyId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json(properties);
    } catch (error) {
      console.error('Error fetching agency properties:', error);
      res.status(500).json({
        error: 'Database error',
        message: error.message
      });
    }
  }
}

module.exports = PropertyController;
