const userService = require('../services/userService');

async function createUser(req, res) {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function updateUser(req, res) {
  try {
    const user = await userService.updateUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getUser(req, res) {
  try {
    const user = await userService.getUserByEmail(req.body.email);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  createUser,
  getUser,
  updateUser
  
};
