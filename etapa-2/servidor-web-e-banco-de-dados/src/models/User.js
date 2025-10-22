const { pool } = require('../config/database');

class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.age = data.age;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findAll() {
    try {
      const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
      return result.rows.map(row => new User(row));
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return null;
      }
      return new User(result.rows[0]);
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }

  static async create(userData) {
    const { name, email, age } = userData;
    try {
      const result = await pool.query(
        'INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *',
        [name, email, age]
      );
      return new User(result.rows[0]);
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('Email already exists');
      }
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  static async update(id, userData) {
    const { name, email, age } = userData;
    try {
      const result = await pool.query(
        'UPDATE users SET name = $1, email = $2, age = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
        [name, email, age, id]
      );
      if (result.rows.length === 0) {
        return null;
      }
      return new User(result.rows[0]);
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('Email already exists');
      }
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return null;
      }
      return new User(result.rows[0]);
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }
}

module.exports = User;
