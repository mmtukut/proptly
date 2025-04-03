// src/controllers/InquiryController.js
const supabase = require('../database');

class InquiryController {
  static async getAllInquiries(req, res) {
    try {
      const { data: inquiries, error } = await supabase
        .from('inquiries')
        .select(`
          *,
          property:properties(
            id,
            title,
            price
          ),
          user:users(
            id,
            email,
            first_name,
            last_name
          ),
          agent:agents(
            id,
            user_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json(inquiries);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      res.status(500).json({
        error: 'Database error',
        message: error.message
      });
    }
  }

  static async getInquiryById(req, res) {
    try {
      const { id } = req.params;
      const { data: inquiry, error } = await supabase
        .from('inquiries')
        .select(`
          *,
          property:properties(
            id,
            title,
            price
          ),
          user:users(
            id,
            email,
            first_name,
            last_name
          ),
          agent:agents(
            id,
            user_id
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!inquiry) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Inquiry not found'
        });
      }

      res.json(inquiry);
    } catch (error) {
      console.error('Error fetching inquiry:', error);
      res.status(500).json({
        error: 'Database error',
        message: error.message
      });
    }
  }

  static async createInquiry(req, res) {
    try {
      const {
        property_id,
        user_id,
        agent_id,
        message,
        contact_email,
        contact_phone
      } = req.body;

      // Validate required fields
      if (!property_id || !message || !contact_email) {
        return res.status(400).json({
          error: 'Missing fields',
          message: 'Property ID, message, and contact email are required'
        });
      }

      const { data: inquiry, error } = await supabase
        .from('inquiries')
        .insert([{
          property_id,
          user_id,
          agent_id,
          message,
          contact_email,
          contact_phone,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      res.status(201).json(inquiry);
    } catch (error) {
      console.error('Error creating inquiry:', error);
      res.status(500).json({
        error: 'Database error',
        message: error.message
      });
    }
  }

  static async updateInquiry(req, res) {
    try {
      const { id } = req.params;
      const { status, agent_id } = req.body;

      if (!['pending', 'responded', 'closed'].includes(status)) {
        return res.status(400).json({
          error: 'Invalid status',
          message: 'Status must be pending, responded, or closed'
        });
      }

      const { data: inquiry, error } = await supabase
        .from('inquiries')
        .update({
          status,
          agent_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (!inquiry) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Inquiry not found'
        });
      }

      res.json(inquiry);
    } catch (error) {
      console.error('Error updating inquiry:', error);
      res.status(500).json({
        error: 'Database error',
        message: error.message
      });
    }
  }

  static async deleteInquiry(req, res) {
    try {
      const { id } = req.params;
      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      res.json({
        message: 'Inquiry deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      res.status(500).json({
        error: 'Database error',
        message: error.message
      });
    }
  }

  static async getInquiriesByProperty(req, res) {
    try {
      const { propertyId } = req.params;
      const { data: inquiries, error } = await supabase
        .from('inquiries')
        .select(`
          *,
          property:properties(
            id,
            title,
            price
          ),
          user:users(
            id,
            email,
            first_name,
            last_name
          ),
          agent:agents(
            id,
            user_id
          )
        `)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json(inquiries);
    } catch (error) {
      console.error('Error fetching property inquiries:', error);
      res.status(500).json({
        error: 'Database error',
        message: error.message
      });
    }
  }

  static async getInquiriesByUser(req, res) {
    try {
      const { userId } = req.params;
      const { data: inquiries, error } = await supabase
        .from('inquiries')
        .select(`
          *,
          property:properties(
            id,
            title,
            price
          ),
          user:users(
            id,
            email,
            first_name,
            last_name
          ),
          agent:agents(
            id,
            user_id
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json(inquiries);
    } catch (error) {
      console.error('Error fetching user inquiries:', error);
      res.status(500).json({
        error: 'Database error',
        message: error.message
      });
    }
  }

  static async getInquiriesByAgent(req, res) {
    try {
      const { agentId } = req.params;
      const { data: inquiries, error } = await supabase
        .from('inquiries')
        .select(`
          *,
          property:properties(
            id,
            title,
            price
          ),
          user:users(
            id,
            email,
            first_name,
            last_name
          ),
          agent:agents(
            id,
            user_id
          )
        `)
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json(inquiries);
    } catch (error) {
      console.error('Error fetching agent inquiries:', error);
      res.status(500).json({
        error: 'Database error',
        message: error.message
      });
    }
  }
}

module.exports = InquiryController;
