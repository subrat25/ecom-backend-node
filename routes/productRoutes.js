const express = require('express');
const router = express.Router();
const productController = require('../src/controllers/productController');
const authMiddleware = require('../src/middlewares/authMiddleware'); 
const userService = require('../src/services/userService');


router.get('/', productController.getAllProducts);
router.get('/prodId', productController.getProductById); 

// Middleware to verify JWT token and check user's role
async function isAdmin(req, res, next) {
    const userEmail = req.user.email; // Assuming the user information is stored in req.user after token verification
    try {
      const reqUser = await userService.getUserByEmail(userEmail);
      if (reqUser && reqUser.role === 'admin') {
        next(); // Proceed to the next middleware or route handler
      } else {
        res.status(403).json({ message: 'Access forbidden' }); // User is not an admin
      }
    } catch (error) {
      res.status(500).json({ message: error.message }); // Internal server error
    }
  }

// Protected routes for admin actions
router.post('/', authMiddleware.authenticateToken, isAdmin, productController.addProduct);
router.put('/:id', authMiddleware.authenticateToken, isAdmin, productController.updateProduct);
router.delete('/:id', authMiddleware.authenticateToken, isAdmin, productController.deleteProduct);

module.exports = router;
