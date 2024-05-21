const db = require('../config/db');
const Address = require('../models/addressModel');

// Function to create a new address
async function createAddress(addressData) {
  try {
    const [result] = await db.execute(
      'INSERT INTO address (user_id, house, street, pincode, isDefault) VALUES (?, ?, ?, ?, ?)',
      [addressData.userId, addressData.house, addressData.street, addressData.pincode, addressData.isDefault]
    );

    addressData.id = result.insertId;

    return addressData;
  } catch (error) {
    throw new Error('Error creating address: ' + error.message);
  }
}

// Function to update an existing address
async function updateAddress(addressId, addressData) {
  try {
    const [addressRows] = await db.execute(
      'SELECT user_id FROM address WHERE id = ?',
      [addressId]
    );

    if (addressRows.length === 0) {
      throw new Error('Address not found');
    }

    const userId = addressRows[0].user_id;
    if (userId !== addressData.userId) {
      return { status: 401, message: "You are unauthorized to make this change" };
    }

    // Ensure that all addressData properties are defined or set them to null if undefined
    const { house, street, pincode, isDefault } = addressData;
    const params = [house, street, pincode, isDefault, addressId];

    const [result] = await db.execute(
      'UPDATE address SET house = ?, street = ?, pincode = ?, isDefault = ? WHERE id = ?',
      params
    );

    if (result.affectedRows === 0) {
      throw new Error('Address not found or not updated');
    }

    return { message: 'Address updated successfully' };
  } catch (error) {
    console.log(error);
    throw new Error('Error updating address: ' + error.message);
  }
}



// Function to remove an address

async function removeAddress(addressId, userId) {
  try {
    // Check if the address belongs to the user
    const [addressRows] = await db.execute(
      'SELECT user_id FROM address WHERE id = ?',
      [addressId]
    );

    if (addressRows.length === 0) {
      throw new Error('Address not found');
    }

    if (addressRows[0].user_id !== userId) {
      console.log('this is address delete check');
      console.log(userId);
      console.log(addressRows[0].user_id);
      return { status: 401, message: "You are unauthorized to delete this address" };
    }

    const [result] = await db.execute(
      'DELETE FROM address WHERE id = ?',
      [addressId]
    );

    if (result.affectedRows === 0) {
      throw new Error('Address not found or not deleted');
    }

    return { message: 'Address deleted successfully' };
  } catch (error) {
    console.log(error);
    throw new Error('Error deleting address: ' + error.message);
  }
}


module.exports = {
  createAddress,
  updateAddress,
  removeAddress
};
