const db = require('../config/db');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Purchase = require('../models/purchaseModel');
const Address = require('../models/addressModel');

async function createPurchase(userId, addressId) {
    console.log('This is createPurchase service');
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();
       
        // Check if the address belongs to the user
        const [addressRows] = await connection.execute(
            'SELECT * FROM address WHERE id = ? AND user_id = ?',
            [addressId, userId]
        );

        console.log(`Address Rows: ${JSON.stringify(addressRows)}`);

        if (addressRows.length === 0) {
            throw new Error('Address not found or does not belong to the user');
        }

        // Get cart items and calculate the total cost
        const [cartItems] = await connection.execute(
            'SELECT c.item_id, c.quantity, c.session_id, p.price, p.quantity AS inventory_quantity FROM cart c JOIN products p ON c.item_id = p.id WHERE c.user_id = ? AND c.isActiveSession = TRUE',
            [userId]
        );

        console.log(`Cart Items: ${JSON.stringify(cartItems)}`);

        if (cartItems.length === 0) {
            throw new Error('No items found in cart');
        }

        let totalCost = 0;
        for (const item of cartItems) {
            if (item.quantity > item.inventory_quantity) {
                throw new Error(`Not enough quantity for item ID ${item.item_id}`);
            }
            totalCost += item.quantity * item.price;
        }

        const sessionId = cartItems[0].session_id;

        // Create the purchase record with the address ID
        const [result] = await connection.execute(
            'INSERT INTO purchase (user_id, session_id, total_cost, address_id) VALUES (?, ?, ?, ?)',
            [userId, sessionId, totalCost, addressId]
        );

        console.log(`Purchase Insert Result: ${JSON.stringify(result)}`);

        const purchaseId = result.insertId;

        // Reduce the quantity of items in the product table
        for (const item of cartItems) {
            await connection.execute(
                'UPDATE products SET quantity = quantity - ? WHERE id = ?',
                [item.quantity, item.item_id]
            );
        }

        // Update the cart to set isActiveSession to false
        await connection.execute(
            'UPDATE cart SET isActiveSession = FALSE WHERE user_id = ? AND session_id = ?',
            [userId, sessionId]
        );

        await connection.commit();

        return { id: purchaseId, totalCost, sessionId };
    } catch (error) {
        await connection.rollback();
        console.error("Error in createPurchase service:", error);
        throw new Error('Error creating purchase: ' + error.message);
    } finally {
        connection.release();
    }
}

module.exports = {
    createPurchase
};
