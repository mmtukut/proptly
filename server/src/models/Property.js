// src/models/Property.js
const supabase = require('../database');

class Property {
  constructor(id, agent_id, location, price, description) {
    this.id = id;
    this.agent_id = agent_id;
    this.location = location;
    this.price = price;
    this.description = description;
  }

  static async findAll() {
    const { data, error } = await supabase.from('Properties').select('*');
    if (error) throw error;
    return data.map(property => new Property(property.id, property.agent_id, property.location, property.price, property.description));
  }

  static async findById(id) {
    const { data, error } = await supabase.from('Properties').select('*').eq('id', id).single();
    if (error) throw error;
    return new Property(data.id, data.agent_id, data.location, data.price, data.description);
  }

  static async create(property) {
    const { data, error } = await supabase.from('Properties').insert(property).select().single();
    if (error) throw error;
    return new Property(data.id, data.agent_id, data.location, data.price, data.description);
  }

  static async update(id, property) {
    const { data, error } = await supabase.from('Properties').update(property).eq('id', id).select().single();
    if (error) throw error;
    return new Property(data.id, data.agent_id, data.location, data.price, data.description);
  }

  static async delete(id) {
    const { error } = await supabase.from('Properties').delete().eq('id', id);
    if (error) throw error;
  }
}

module.exports = Property;
