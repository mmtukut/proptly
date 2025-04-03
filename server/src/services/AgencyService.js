// src/services/AgencyService.js
const Agency = require('../models/Agency');
    
class AgencyService {
  static async getAllAgencies() {
    return Agency.findAll();
  }

  static async getAgencyById(id) {
    return Agency.findById(id);
  }

  static async createAgency(agency) {
    return Agency.create(agency);
  }

  static async updateAgency(id, agency) {
    return Agency.update(id, agency);
  }

  static async deleteAgency(id) {
    return Agency.delete(id);
  }
}

module.exports = AgencyService;
