// src/models/Agent.js
const supabase = require('../database');

class Agent {
  constructor(id, agency_id, name, email) {
    this.id = id;
    this.agency_id = agency_id;
    this.name = name;
    this.email = email;
  }

  static async findAll() {
    const { data, error } = await supabase.from('Agents').select('*');
    if (error) throw error;
    return data.map(agent => new Agent(agent.id, agent.agency_id, agent.name, agent.email));
  }

  static async findById(id) {
    const { data, error } = await supabase.from('Agents').select('*').eq('id', id).single();
    if (error) throw error;
    return new Agent(data.id, data.agency_id, data.name, data.email);
  }

  static async create(agent) {
    const { data, error } = await supabase.from('Agents').insert(agent).select().single();
    if (error) throw error;
    return new Agent(data.id, data.agency_id, data.name, data.email);
  }

  static async update(id, agent) {
    const { data, error } = await supabase.from('Agents').update(agent).eq('id', id).select().single();
    if (error) throw error;
    return new Agent(data.id, data.agency_id, data.name, data.email);
  }

  static async delete(id) {
    const { error } = await supabase.from('Agents').delete().eq('id', id);
    if (error) throw error;
  }
}

module.exports = Agent;
