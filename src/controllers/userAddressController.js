const AddressService = require('../services/userAddressService');
const Address = require('../models/addressModel');

async function createAddress(req, res) {
  try {
    const addressVal = new Address(
      null,
      req.user.userId,
      req.body.house,
      req.body.street,
      req.body.pincode,
      new Date(),
      req.body.isDefault
    );
    const address = await AddressService.createAddress(addressVal);
    res.status(201).json(address);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function updateAddress(req, res) {
  try {
    const addressVal = new Address(
      req.query.id,
      req.user.userId,
      req.body.house,
      req.body.street,
      req.body.pincode,
      new Date(),
      req.body.isDefault || false
    );
   
    const address = await AddressService.updateAddress(req.query.id, addressVal);
    res.status(200).json(address);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
}

async function removeAddress(req, res) {
  try {
    const address = await AddressService.removeAddress(req.query.id,req.user.userId);
    res.status(200).json(address);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  createAddress,
  updateAddress,
  removeAddress
};
