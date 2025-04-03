// src/services/SavedPropertyService.js
const SavedProperty = require('../models/SavedProperty');
    
class SavedPropertyService {
  static async getAllSavedProperties() {
    return SavedProperty.findAll();
  }

  static async getSavedPropertyById(id) {
    return SavedProperty.findById(id);
  }

  static async createSavedProperty(savedProperty) {
    return SavedProperty.create(savedProperty);
  }

  static async updateSavedProperty(id, savedProperty) {
    return SavedProperty.update(id, savedProperty);
  }

  static async deleteSavedProperty(id) {
    return SavedProperty.delete(id);
  }
}

module.exports = SavedPropertyService;
