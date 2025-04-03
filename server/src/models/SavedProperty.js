// src/models/SavedProperty.js
const supabase = require('../database');

class SavedProperty {
  constructor(id, user_id, property_id, created_at) {
    this.id = id;
    this.user_id = user_id;
    this.property_id = property_id;
    this.created_at = created_at;
  }

  static async findAll() {
    const { data, error } = await supabase.from('SavedProperties').select('*');
    if (error) throw error;
    return data.map(savedProperty => new SavedProperty(savedProperty.id, savedProperty.user_id, savedProperty.property_id, savedProperty.created_at));
  }

  static async findById(id) {
    const { data, error } = await supabase.from('SavedProperties').select('*').eq('id', id).single();
    if (error) throw error;
    return new SavedProperty(data.id, data.user_id, data.property_id, data.created_at);
  }

  static async create(savedProperty) {
    const { data, error } = await supabase.from('SavedProperties').insert(savedProperty).select().single();
    if (error) throw error;
    return new SavedProperty(data.id, data.user_id, data.property_id, data.created_at);
  }

  static async update(id, savedProperty) {
    const { data, error } = await supabase.from('SavedProperties').update(savedProperty).eq('id', id).select().single();
    if (error) throw error;
    return new SavedProperty(data.id, data.user_id, data.property_id, data.created_at);
  }

  static async delete(id) {
    const { error } = await supabase.from('SavedProperties').delete().eq('id', id);
    if (error) throw error;
  }
}

module.exports = SavedProperty;
