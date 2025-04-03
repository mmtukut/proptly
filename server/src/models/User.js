// src/models/User.js
const supabase = require('../database');

class User {
  constructor(id, email, password, name) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
  }

  static async findAll() {
    const { data, error } = await supabase.from('Users').select('*');
    if (error) throw error;
    return data.map(user => new User(user.id, user.email, user.password, user.name));
  }

  static async findById(id) {
    const { data, error } = await supabase.from('Users').select('*').eq('id', id).single();
    if (error) throw error;
    return new User(data.id, data.email, data.password, data.name);
  }

  static async create(user) {
    const { data, error } = await supabase.from('Users').insert(user).select().single();
    if (error) throw error;
    return new User(data.id, data.email, data.password, data.name);
  }

  static async update(id, user) {
    const { data, error } = await supabase.from('Users').update(user).eq('id', id).select().single();
    if (error) throw error;
    return new User(data.id, data.email, data.password, data.name);
  }

  static async delete(id) {
    const { error } = await supabase.from('Users').delete().eq('id', id);
    if (error) throw error;
  }
}

module.exports = User;
