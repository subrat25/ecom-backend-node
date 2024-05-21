const db = require('../config/db');

async function generateSessionId() {
  // Function to generate a random session ID
  const sessionIdLength = 10;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let sessionId = '';
  for (let i = 0; i < sessionIdLength; i++) {
    sessionId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return sessionId;
}

async function getCart(userid){
  try{

    const [carts] = await db.execute('SELECT item_id,quantity FROM cart WHERE user_id = ? AND isActiveSession = TRUE', [userid]);

    if (carts.length > 0) {
      return carts;
    }
    else
    return {message: "Cart is empty"};

  }
  catch (error) {
    throw new Error('Error getting  the cart: ' + error.message);
  }

}

async function addToCart(userId, itemId, quantity) {
  try {
    // Check if there is an active session for the user
    const [activeSessions] = await db.execute('SELECT session_id FROM cart WHERE user_id = ? AND isActiveSession = TRUE', [userId]);
    let sessionId;
    if (activeSessions.length > 0) {
      sessionId = activeSessions[0].session_id;
    } else {
      // Generate a random session ID if no active session found
      sessionId = await generateSessionId();
    }

    // Check if the same product is already in the cart
    const [existingCartItem] = await db.execute('SELECT id, quantity FROM cart WHERE user_id = ? AND session_id = ? AND item_id = ?', [userId, sessionId, itemId]);
    if (existingCartItem.length > 0) {
      // Update the quantity if the same product is already in the cart
      const cartId = existingCartItem[0].id;
      const updatedQuantity = existingCartItem[0].quantity + quantity;
      await db.execute('UPDATE cart SET quantity = ? WHERE id = ?', [updatedQuantity, cartId]);
      return cartId;
    }

    // Check if the quantity is available
    const [rows] = await db.execute('SELECT quantity FROM products WHERE id = ?', [itemId]);
    if (rows.length === 0) {
      throw new Error('Product not found');
    }
    const availableQuantity = rows[0].quantity;
    if (quantity > availableQuantity) {
      throw new Error('Quantity exceeds available stock');
    }

    // Insert into cart table
    const [result] = await db.execute('INSERT INTO cart (user_id, session_id, item_id, quantity) VALUES (?, ?, ?, ?)', [userId, sessionId, itemId, quantity]);
    return result.insertId;
  } catch (error) {
    throw new Error('Error adding item to cart: ' + error.message);
  }
}

async function updateCart(userId, itemId, quantity) {
  try {
    await db.execute('UPDATE cart SET quantity = ? WHERE user_id = ? AND item_id = ? AND isActiveSession = TRUE', [quantity, userId, itemId]);
  } catch (error) {
    throw new Error('Error updating cart');
  }
}


async function deactivateSession(sessionId) {
  try {
    await db.execute('UPDATE cart SET isActiveSession = FALSE WHERE session_id = ?', [sessionId]);
  } catch (error) {
    throw new Error('Error deactivating session');
  }
}

module.exports = {
  addToCart,
  updateCart,
  getCart,
  deactivateSession
};
