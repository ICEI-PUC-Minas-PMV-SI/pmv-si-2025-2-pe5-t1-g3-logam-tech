const { pool } = require('../config/database');

class Course {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.partner = data.partner;
    this.price = data.price;
    this.category = data.category;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findAll() {
    try {
      const result = await pool.query('SELECT * FROM courses ORDER BY created_at DESC');
      return result.rows.map(row => new Course(row));
    } catch (error) {
      throw new Error(`Error fetching courses: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const result = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return null;
      }
      return new Course(result.rows[0]);
    } catch (error) {
      throw new Error(`Error fetching course: ${error.message}`);
    }
  }

  static async create(courseData) {
    const { name, description, partner, price, category } = courseData;
    try {
      const result = await pool.query(
        'INSERT INTO courses (name, description, partner, price, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, description, partner, price, category]
      );
      return new Course(result.rows[0]);
    } catch (error) {
      throw new Error(`Error creating course: ${error.message}`);
    }
  }

  static async update(id, courseData) {
    const { name, description, partner, price, category } = courseData;
    try {
      const result = await pool.query(
        'UPDATE courses SET name = $1, description = $2, partner = $3, price = $4, category = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
        [name, description, partner, price, category, id]
      );
      if (result.rows.length === 0) {
        return null;
      }
      return new Course(result.rows[0]);
    } catch (error) {
      throw new Error(`Error updating course: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      const result = await pool.query('DELETE FROM courses WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return null;
      }
      return new Course(result.rows[0]);
    } catch (error) {
      throw new Error(`Error deleting course: ${error.message}`);
    }
  }
}

module.exports = Course;

