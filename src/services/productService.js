const db = require('../config/db');
const Product = require('../models/productModel');

async function getAllProducts() {
  try {
    const [rows] = await db.execute('SELECT * FROM products');
    return rows;
  } catch (error) {
    throw new Error('Error fetching products');
  }
}

async function getProductById(productId) {
  try {
    const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [productId]);
    console.log(rows);
    if (rows.length === 0) {
      throw new Error('Product not found');
    }
    return rows[0];
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching product',error);
  }
}

async function addProduct(productData) {
  try {
    // Create a new Product instance using the provided data
    const product = new Product(null, productData.name, productData.description, productData.price, productData.quantity);
    
    // Your code to insert the product into the database
    const [result] = await db.execute('INSERT INTO products (name, description, price, quantity) VALUES (?, ?, ?, ?)', [product.name, product.description, product.price, product.quantity]);
    
    // Set the ID of the product object based on the inserted row's ID
    product.id = result.insertId;

    return product;
  } catch (error) {
    throw new Error('Error adding product');
  }
}

async function updateProduct(productData) {
  try {
    // Create a new Product instance using the provided data
    const product = new Product(productData.id, productData.name, productData.description, productData.price, productData.quantity);
    
    // Your code to update the product in the database
    await db.execute('UPDATE products SET name = ?, description = ?, price = ?, quantity = ? WHERE id = ?', [product.name, product.description, product.price, product.quantity, product.id]);
    
    return product;
  } catch (error) {
    throw new Error('Error updating product');
  }
}

async function deleteProduct(productId) {
  try {
    // Your code to delete the product from the database
    await db.execute('DELETE FROM products WHERE id = ?', [productId]);
    
    // Return a success message or any relevant data
    return { message: 'Product deleted successfully' };
  } catch (error) {
    throw new Error('Error deleting product');
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
};
