// src/models/PropertyInfrastructure.js
const supabase = require('../database');

class PropertyInfrastructure {
  constructor(property_id, infrastructure_id) {
    this.property_id = property_id;
    this.infrastructure_id = infrastructure_id;
  }

  static async findAll() {
    const { data, error } = await supabase.from('PropertyInfrastructure').select('*');
    if (error) throw error;
    return data.map(propertyInfrastructure => new PropertyInfrastructure(propertyInfrastructure.property_id, propertyInfrastructure.infrastructure_id));
  }

  static async create(propertyInfrastructure) {
    const { data, error } = await supabase.from('PropertyInfrastructure').insert(propertyInfrastructure).select().single();
    if (error) throw error;
    return new PropertyInfrastructure(data.property_id, data.infrastructure_id);
  }

  static async delete(property_id, infrastructure_id) {
    const { error } = await supabase.from('PropertyInfrastructure').delete().match({property_id, infrastructure_id});
    if (error) throw error;
  }
}

module.exports = PropertyInfrastructure;
