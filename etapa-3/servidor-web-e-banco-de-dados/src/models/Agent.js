const { pool } = require('../config/database');

class Agent {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.department = data.department;
    this.location = data.location;
    this.status = data.status;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findAll() {
    try {
      const result = await pool.query('SELECT * FROM agents ORDER BY created_at DESC');
      return result.rows.map(row => new Agent(row));
    } catch (error) {
      throw new Error(`Error fetching agents: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const result = await pool.query('SELECT * FROM agents WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return null;
      }
      return new Agent(result.rows[0]);
    } catch (error) {
      throw new Error(`Error fetching agent: ${error.message}`);
    }
  }

  static async create(agentData) {
    const { name, email, phone, department, location, status } = agentData;
    try {
      const result = await pool.query(
        'INSERT INTO agents (name, email, phone, department, location, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name, email, phone, department, location, status || 'ativo']
      );
      return new Agent(result.rows[0]);
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('Email already exists');
      }
      throw new Error(`Error creating agent: ${error.message}`);
    }
  }

  static async update(id, agentData) {
    const { name, email, phone, department, location, status } = agentData;
    try {
      const result = await pool.query(
        'UPDATE agents SET name = $1, email = $2, phone = $3, department = $4, location = $5, status = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
        [name, email, phone, department, location, status, id]
      );
      if (result.rows.length === 0) {
        return null;
      }
      return new Agent(result.rows[0]);
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('Email already exists');
      }
      throw new Error(`Error updating agent: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      const result = await pool.query('DELETE FROM agents WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return null;
      }
      return new Agent(result.rows[0]);
    } catch (error) {
      throw new Error(`Error deleting agent: ${error.message}`);
    }
  }
}

module.exports = Agent;

