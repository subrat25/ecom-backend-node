const cartService = require('../services/cartService');

async function addToCart(req, res) {
  try {
    const { userId } = req.user; 
    const { sessionId, itemId, quantity, price, totalPrice } = req.body;
    const cartId = await cartService.addToCart(userId, itemId, quantity);
    res.status(200).json({ cartId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getCart(req, res) {
  try {
    const { userId } = req.user; 
    const cart = await cartService.getCart(userId);
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateCart(req, res) {
  try {
    const { userId } = req.user; 
    const { itemId, quantity } = req.body;
    await cartService.updateCart(userId, itemId, quantity);
    res.status(200).json({ message: 'Cart updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deactivateSession(req, res) {
  try {
    const { sessionId } = req.params;
    await cartService.deactivateSession(sessionId);
    res.status(200).json({ message: 'Session deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  addToCart,
  updateCart,
  getCart,
  deactivateSession
};
