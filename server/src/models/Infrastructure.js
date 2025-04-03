// src/models/Infrastructure.js
const supabase = require('../database');

class Infrastructure {
  constructor(id, name, type, location) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.location = location
  }

  static async findAll() {
    const { data, error } = await supabase.from('Infrastructures').select('*');
    if (error) throw error;
    return data.map(infrastructure => new Infrastructure(infrastructure.id, infrastructure.name, infrastructure.type, infrastructure.location));
  }

  static async findById(id) {
    const { data, error } = await supabase.from('Infrastructures').select('*').eq('id', id).single();
    if (error) throw error;
    return new Infrastructure(data.id, data.name, data.type, data.location);
  }

  static async create(infrastructure) {
    const { data, error } = await supabase.from('Infrastructures').insert(infrastructure).select().single();
    if (error) throw error;
    return new Infrastructure(data.id, data.name, data.type, data.location);
  }

  static async update(id, infrastructure) {
    const { data, error } = await supabase.from('Infrastructures').update(infrastructure).eq('id', id).select().single();
    if (error) throw error;
    return new Infrastructure(data.id, data.name, data.type, data.location);
  }

  static async delete(id) {
    const { error } = await supabase.from('Infrastructures').delete().eq('id', id);
    if (error) throw error;
  }
}

module.exports = Infrastructure;
