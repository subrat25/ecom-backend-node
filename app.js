require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken'); // Import JWT module
const app = express();
const bodyParser = require('body-parser');
const userController = require('./src/controllers/userController');
const userService = require('./src/services/userService');
const authMiddleware = require('./src/middlewares/authMiddleware');
// const swagger = require('./swagger');
app.use(express.json());

// swagger(app);
// Authorization Endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.authenticateUser(email, password);
      if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const accessToken = jwt.sign({ userId: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

const productRoutes = require('./routes/productRoutes');
app.use('/products',authMiddleware.authenticateToken, productRoutes);

const cartRoutes = require('./routes/cartRoutes');
app.use('/cart',authMiddleware.authenticateToken, cartRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
