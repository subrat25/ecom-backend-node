const express = require('express');
const router = express.Router();
const userController = require('../src/controllers/userController');
const userAddress = require('../src/controllers/userAddressController');
const authMiddleware = require('../src/middlewares/authMiddleware');
const purchaseController = require('../src/controllers/purchaseController');

router.post('/', userController.createUser);
router.put('/', userController.updateUser);
router.get('/checkUserEmail',authMiddleware.authenticateToken, userController.getUser);

router.post('/address',authMiddleware.authenticateToken, userAddress.createAddress);
router.put('/address',authMiddleware.authenticateToken, userAddress.updateAddress);
router.delete('/address',authMiddleware.authenticateToken, userAddress.removeAddress);


router.post('/purchase',authMiddleware.authenticateToken, purchaseController.createPurchase);


module.exports = router;
