const { pool } = require('../config/database');

class Product {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.stock = data.stock;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findAll() {
    try {
      const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
      return result.rows.map(row => new Product(row));
    } catch (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return null;
      }
      return new Product(result.rows[0]);
    } catch (error) {
      throw new Error(`Error fetching product: ${error.message}`);
    }
  }

  static async create(productData) {
    const { name, description, price, stock } = productData;
    try {
      const result = await pool.query(
        'INSERT INTO products (name, description, price, stock) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, description, price, stock]
      );
      return new Product(result.rows[0]);
    } catch (error) {
      throw new Error(`Error creating product: ${error.message}`);
    }
  }

  static async update(id, productData) {
    const { name, description, price, stock } = productData;
    try {
      const result = await pool.query(
        'UPDATE products SET name = $1, description = $2, price = $3, stock = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
        [name, description, price, stock, id]
      );
      if (result.rows.length === 0) {
        return null;
      }
      return new Product(result.rows[0]);
    } catch (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return null;
      }
      return new Product(result.rows[0]);
    } catch (error) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  }
}

module.exports = Product;
