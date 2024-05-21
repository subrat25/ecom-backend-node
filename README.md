**E-commerce Backend**


This project provides a backend service for an e-commerce platform, including user management, address management, shopping cart, and purchase processing functionalities. 
It is built with Node.js, Express.js, and MySQL.

Table of Contents
Installation
Configuration
  API Endpoints
  User Endpoints
  Address Endpoints
  Cart Endpoints
  Purchase Endpoints
Database Schema

Installation
Clone the repository:


git clone https://github.com/subrat25/ecom-backend-node.git


Navigate to the project directory:


cd ecom-backend-node
Install the dependencies:

**npm install**
Create a .env file in the root of the project and add your database configuration and JWT secret:

Copy code
host=your_db_host
user=your_db_user
password=your_db_password
database=your_db_name
ACCESS_TOKEN_SECRET=your_jwt_secret


Start the server:

npm start / node app.js


Configuration
The project uses MySQL for the database. Ensure you have MySQL installed and running. Update the database configuration in the .env file with your MySQL credentials.


**Database Schema**

create database dbname
use dbname

-- create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer'
);
-- create cart table
CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isActiveSession BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (item_id) REFERENCES products(id)
);
-- create products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 0
);
-- create address table
CREATE TABLE address (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    house VARCHAR(25) NOT NULL,
    street VARCHAR(25) NOT NULL,
    pincode VARCHAR(6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isDefault BOOLEAN DEFAULT False,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- create purchase table
CREATE TABLE purchase (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    total_cost DECIMAL(10, 2) NOT NULL,
    address_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);




