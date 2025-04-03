// src/models/Agency.js
const supabase = require('../database');

class Agency {
  constructor(id, name, location) {
    this.id = id;
    this.name = name;
    this.location = location;
  }

  static async findAll() {
    const { data, error } = await supabase.from('Agencies').select('*');
    if (error) throw error;
    return data.map(agency => new Agency(agency.id, agency.name, agency.location));
  }

  static async findById(id) {
    const { data, error } = await supabase.from('Agencies').select('*').eq('id', id).single();
    if (error) throw error;
    return new Agency(data.id, data.name, data.location);
  }

  static async create(agency) {
    const { data, error } = await supabase.from('Agencies').insert(agency).select().single();
    if (error) throw error;
    return new Agency(data.id, data.name, data.location);
  }

  static async update(id, agency) {
    const { data, error } = await supabase.from('Agencies').update(agency).eq('id', id).select().single();
    if (error) throw error;
    return new Agency(data.id, data.name, data.location);
  }

  static async delete(id) {
    const { error } = await supabase.from('Agencies').delete().eq('id', id);
    if (error) throw error;
  }
}

module.exports = Agency;
