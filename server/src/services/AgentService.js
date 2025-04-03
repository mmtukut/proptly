// src/services/AgentService.js
const Agent = require('../models/Agent');
    
class AgentService {
  static async getAllAgents() {
    return Agent.findAll();
  }

  static async getAgentById(id) {
    return Agent.findById(id);
  }

  static async createAgent(agent) {
    return Agent.create(agent);
  }

  static async updateAgent(id, agent) {
    return Agent.update(id, agent);
  }

  static async deleteAgent(id) {
    return Agent.delete(id);
  }
}

module.exports = AgentService;
