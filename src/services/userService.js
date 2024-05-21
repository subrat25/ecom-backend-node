const bcrypt = require('bcrypt');
const db = require('../config/db');
const User = require('../models/userModel'); // Import the User class

async function createUser(userData) {
  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new User(null, userData.username, userData.email, hashedPassword, userData.role || 'customer');

    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [userData.email]);
    if (rows.length === 1) {
      
      return {
        "message": "User already exists" };
      
    }

    // Your code to insert the user into the database
    const [result] = await db.execute('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', [user.username, user.email, user.password, user.role]);

    // Set the ID of the user object
    user.id = result.insertId;

    return user;
  } catch (error) {
    console.log(error);
    throw new Error('Error creating user');
  }
}

async function getUserByEmail(email) {
  try {
    // Your code to fetch user by email from the database
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      throw new Error('User not found');
    }
    const userData = rows[0];
    return new User(userData.id, userData.username, userData.email, 'Hidden', userData.role);
  } catch (error) {
    throw new Error('Error fetching user');
  }
}

async function updateUser(UpdateUserData) {
  try {
    // Verify the admin user credentials before proceeding
    const adminUser = await authenticateUser(UpdateUserData.adminuseremail, UpdateUserData.adminuserpassword);
    if (!adminUser || adminUser.role !== 'admin') {
      throw new Error('Invalid admin credentials');
    }

    // Hash the new password before updating it
    const updatedHashedPassword = await bcrypt.hash(UpdateUserData.password, 10);
    
    // Your code to update the user password in the database
    const [result] = await db.execute('UPDATE users SET password = ? WHERE email = ?', [updatedHashedPassword, UpdateUserData.email]);

    // Check if any rows were affected by the update operation
    if (result.affectedRows === 0) {
      throw new Error('User not found or password not updated');
    }

    // Return a success message or any relevant data
    return { message: 'User password updated successfully' };
  } catch (error) {
    throw new Error('Error updating user: ' + error.message);
  }
}
async function authenticateUser(emailid, password) {
  try {
    // Fetch user from the database by email
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [emailid]);
    if (rows.length === 0) {
      // No user found with the given email
      return null;
    }

    const user = rows[0];
    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      // Passwords don't match
      return null;
    }

    // If email and password match, return the user object (excluding password)
    const { id, username, email, role } = user;
    return { id, username, email, role };
  } catch (error) {
    // Log any errors that occur during authentication
    console.error("Error authenticating user:", error);
   return null;
  }
}

// Other methods like deleteUser, getUserById, etc., can be similarly modified to use the User class

module.exports = {
  createUser,
  getUserByEmail,
  updateUser,
  authenticateUser
};
