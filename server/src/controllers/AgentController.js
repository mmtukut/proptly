// src/controllers/AgentController.js
const supabase = require('../database');

class AgentController {
  static async getAllAgents(req, res) {
    try {
      const { data: agents, error } = await supabase
        .from('agents')
        .select(`
          *,
          user:users(
            id,
            email,
            first_name,
            last_name
          ),
          agency:agencies(
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json(agents);
    } catch (error) {
      console.error('Error fetching agents:', error);
      res.status(500).json({
        error: 'Database error',
        message: error.message
      });
    }
  }

  static async getAgentById(req, res) {
    try {
      const { id } = req.params;
      const { data: agent, error } = await supabase
        .from('agents')
        .select(`
          *,
          user:users(
            id,
            email,
            first_name,
            last_name
          ),
          agency:agencies(
            id,
            name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!agent) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Agent not found'
        });
      }

      res.json(agent);
    } catch (error) {
      console.error('Error fetching agent:', error);
      res.status(500).json({
        error: 'Database error',
        message: error.message
      });
    }
  }

  static async applyAsAgent(req, res) {
    try {
      const {
        user_id,
        agency_id,
        license_number,
        specialization,
        experience_years,
        bio,
        phone
      } = req.body;

      // Validate required fields
      if (!user_id || !license_number) {
        return res.status(400).json({
          error: 'Missing fields',
          message: 'User ID and license number are required'
        });
      }

      // Check if user already has an agent profile
      const { data: existingAgent } = await supabase
        .from('agents')
        .select('id')
        .eq('user_id', user_id)
        .single();

      if (existingAgent) {
        return res.status(400).json({
          error: 'Duplicate entry',
          message: 'User already has an agent profile'
        });
      }

      const { data: agent, error } = await supabase
        .from('agents')
        .insert([{
          user_id,
          agency_id,
          license_number,
          specialization,
          experience_years,
          bio,
          phone,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      res.status(201).json(agent);
    } catch (error) {
      console.error('Error creating agent:', error);
      res.status(500).json({
        error: 'Database error',
        message: error.message
      });
    }
  }

  static async updateAgent(req, res) {
    try {
      const { id } = req.params;
      const {
        agency_id,
        license_number,
        specialization,
        experience_years,
        bio,
        phone,
        profile_image
      } = req.body;

      const { data: agent, error } = await supabase
        .from('agents')
        .update({
          agency_id,
          license_number,
          specialization,
          experience_years,
          bio,
          phone,
          profile_image,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (!agent) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Agent not found'
        });
      }

      res.json(agent);
    } catch (error) {
      console.error('Error updating agent:', error);
      res.status(500).json({
        error: 'Database error',
        message: error.message
      });
    }
  }

  static async deleteAgent(req, res) {
    try {
      const { id } = req.params;
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      res.json({
        message: 'Agent deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting agent:', error);
      res.status(500).json({
        error: 'Database error',
        message: error.message
      });
    }
  }

  static async getAgentsByAgency(req, res) {
    try {
      const { agencyId } = req.params;
      const { data: agents, error } = await supabase
        .from('agents')
        .select(`
          *,
          user:users(
            id,
            email,
            first_name,
            last_name
          ),
          agency:agencies(
            id,
            name
          )
        `)
        .eq('agency_id', agencyId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json(agents);
    } catch (error) {
      console.error('Error fetching agency agents:', error);
      res.status(500).json({
        error: 'Database error',
        message: error.message
      });
    }
  }

  static async updateAgentStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({
          error: 'Invalid status',
          message: 'Status must be pending, approved, or rejected'
        });
      }

      const { data: agent, error } = await supabase
        .from('agents')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (!agent) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Agent not found'
        });
      }

      res.json(agent);
    } catch (error) {
      console.error('Error updating agent status:', error);
      res.status(500).json({
        error: 'Database error',
        message: error.message
      });
    }
  }
}

module.exports = AgentController;
