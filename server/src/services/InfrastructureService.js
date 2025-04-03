// src/services/InfrastructureService.js
const Infrastructure = require('../models/Infrastructure');
    
class InfrastructureService {
  static async getAllInfrastructures() {
    return Infrastructure.findAll();
  }

  static async getInfrastructureById(id) {
    return Infrastructure.findById(id);
  }

  static async createInfrastructure(infrastructure) {
    return Infrastructure.create(infrastructure);
  }

  static async updateInfrastructure(id, infrastructure) {
    return Infrastructure.update(id, infrastructure);
  }

  static async deleteInfrastructure(id) {
    return Infrastructure.delete(id);
  }
}

module.exports = InfrastructureService;
