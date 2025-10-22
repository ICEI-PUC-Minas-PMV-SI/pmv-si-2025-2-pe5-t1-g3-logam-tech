const Product = require('../models/Product');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    // Basic validation
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name and price are required'
      });
    }

    // Price validation
    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number'
      });
    }

    // Stock validation
    if (stock !== undefined && stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock must be a non-negative number'
      });
    }

    const product = await Product.create({ name, description, price, stock });
    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;

    // Basic validation
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name and price are required'
      });
    }

    // Price validation
    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number'
      });
    }

    // Stock validation
    if (stock !== undefined && stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock must be a non-negative number'
      });
    }

    const product = await Product.update(id, { name, description, price, stock });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.delete(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
