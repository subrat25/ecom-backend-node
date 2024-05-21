class Cart {
    constructor(userId, items = []) {
      this.userId = userId;
      this.items = items;
      this.sessionExpiry = null; // Date when the cart session expires
    }
  }
  
  module.exports = Cart;
  