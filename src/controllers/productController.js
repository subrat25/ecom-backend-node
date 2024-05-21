const productService = require('../services/productService');

async function getAllProducts(req, res) {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getProductById(req, res) {
  try {

    const productId = req.query.id;
    const product = await productService.getProductById(productId);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

async function addProduct(req, res) {
  try {
    const productData = req.body;
    const newProduct = await productService.addProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function updateProduct(req, res) {
  try {
    const productId = req.params.id;
    const productData = req.body;
    productData.id = productId; // Ensure the product ID is included in the data
    const updatedProduct = await productService.updateProduct(productData);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const productId = req.params.id;
    await productService.deleteProduct(productId);
    res.status(204).end(); // No content to return after deletion
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
};
