// src/models/Inquiry.js
const supabase = require('../database');

class Inquiry {
  constructor(id, user_id, property_id, message, created_at) {
    this.id = id;
    this.user_id = user_id;
    this.property_id = property_id;
    this.message = message;
    this.created_at = created_at
  }

  static async findAll() {
    const { data, error } = await supabase.from('Inquiries').select('*');
    if (error) throw error;
    return data.map(inquiry => new Inquiry(inquiry.id, inquiry.user_id, inquiry.property_id, inquiry.message, inquiry.created_at));
  }

  static async findById(id) {
    const { data, error } = await supabase.from('Inquiries').select('*').eq('id', id).single();
    if (error) throw error;
    return new Inquiry(data.id, data.user_id, data.property_id, data.message, data.created_at);
  }

  static async create(inquiry) {
    const { data, error } = await supabase.from('Inquiries').insert(inquiry).select().single();
    if (error) throw error;
    return new Inquiry(data.id, data.user_id, data.property_id, data.message, data.created_at);
  }

  static async update(id, inquiry) {
    const { data, error } = await supabase.from('Inquiries').update(inquiry).eq('id', id).select().single();
    if (error) throw error;
    return new Inquiry(data.id, data.user_id, data.property_id, data.message, data.created_at);
  }

  static async delete(id) {
    const { error } = await supabase.from('Inquiries').delete().eq('id', id);
    if (error) throw error;
  }
}

module.exports = Inquiry;
