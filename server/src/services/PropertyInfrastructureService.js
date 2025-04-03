// src/services/PropertyInfrastructureService.js
const PropertyInfrastructure = require('../models/PropertyInfrastructure');
    
class PropertyInfrastructureService {
  static async getAllPropertyInfrastructures() {
    return PropertyInfrastructure.findAll();
  }
  
  static async createPropertyInfrastructure(propertyInfrastructure) {
    return PropertyInfrastructure.create(propertyInfrastructure);
  }
  
  static async deletePropertyInfrastructure(property_id, infrastructure_id) {
    return PropertyInfrastructure.delete(property_id, infrastructure_id);
  }
}

module.exports = PropertyInfrastructureService;
