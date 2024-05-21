const express = require('express');
const router = express.Router();
const cartController = require('../src/controllers/cartController');
const authMiddleware = require('../src/middlewares/authMiddleware');

router.post('/add', authMiddleware.authenticateToken, cartController.addToCart);
router.put('/update', authMiddleware.authenticateToken, cartController.updateCart);
router.get('/', authMiddleware.authenticateToken, cartController.getCart);

module.exports = router;
