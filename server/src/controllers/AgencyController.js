// src/controllers/AgencyController.js
const supabase = require('../database');

class AgencyController {
  static async getAllAgencies(req, res) {
    try {
      const { data: agencies, error } = await supabase
        .from('agencies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json(agencies);
    } catch (error) {
      console.error('Error fetching agencies:', error);
      res.status(500).json({
        error: 'Database error',
        message: error.message
      });
    }
  }

  static async getAgencyById(req, res) {
    try {
      const { id } = req.params;
      const { data: agency, error } = await supabase
        .from('agencies')
        .select(`
          *,
          agents (
            id,
            user_id,
            specialization,
            experience_years,
            status
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!agency) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Agency not found'
        });
      }

      res.json(agency);
    } catch (error) {
      console.error('Error fetching agency:', error);
      res.status(500).json({
        error: 'Database error',
        message: error.message
      });
    }
  }

  static async createAgency(req, res) {
    try {
      const {
        name,
        description,
        logo_url,
        address,
        phone,
        email,
        website
      } = req.body;

      // Validate required fields
      if (!name || !email) {
        return res.status(400).json({
          error: 'Missing fields',
          message: 'Name and email are required'
        });
      }

      // Check if agency with email already exists
      const { data: existingAgency } = await supabase
        .from('agencies')
        .select('id')
        .eq('email', email)
        .single();

      if (existingAgency) {
        return res.status(400).json({
          error: 'Duplicate entry',
          message: 'An agency with this email already exists'
        });
      }

      const { data: agency, error } = await supabase
        .from('agencies')
        .insert([{
          name,
          description,
          logo_url,
          address,
          phone,
          email,
          website
        }])
        .select()
        .single();

      if (error) throw error;

      res.status(201).json(agency);
    } catch (error) {
      console.error('Error creating agency:', error);
      res.status(500).json({
        error: 'Database error',
        message: error.message
      });
    }
  }

  static async updateAgency(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        logo_url,
        address,
        phone,
        email,
        website
      } = req.body;

      // Check if agency exists
      const { data: existingAgency } = await supabase
        .from('agencies')
        .select('id')
        .eq('id', id)
        .single();

      if (!existingAgency) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Agency not found'
        });
      }

      const { data: agency, error } = await supabase
        .from('agencies')
        .update({
          name,
          description,
          logo_url,
          address,
          phone,
          email,
          website,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      res.json(agency);
    } catch (error) {
      console.error('Error updating agency:', error);
      res.status(500).json({
        error: 'Database error',
        message: error.message
      });
    }
  }

  static async deleteAgency(req, res) {
    try {
      const { id } = req.params;

      // Check if agency exists
      const { data: existingAgency } = await supabase
        .from('agencies')
        .select('id')
        .eq('id', id)
        .single();

      if (!existingAgency) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Agency not found'
        });
      }

      const { error } = await supabase
        .from('agencies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      res.json({
        message: 'Agency deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting agency:', error);
      res.status(500).json({
        error: 'Database error',
        message: error.message
      });
    }
  }
}

module.exports = AgencyController;
