import express from 'express';
import cors from 'cors'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path'; 
import { fileURLToPath } from 'url'; 
import { dirname } from 'path'; 
import { MongoClient, ObjectId } from 'mongodb';
import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const app = express();
const PORT = 3000;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('Error connecting to MongoDB:', err));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5500', 'https://yourfrontenddomain.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Content Security Policy header middleware
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' 'unsafe-inline'; img-src 'self' data:;"
  );
  next();
});

// User Schema and Model
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: { type: [String], default: [] },
});

const User = mongoose.model('User', userSchema);

// MongoDB connection for orders
const client = new MongoClient(MONGO_URI);
let db;
async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db('Cluster0');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

connectToDatabase();

// Route for login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token, email: user.email, userId: user._id });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register route
app.post('/api/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ firstName, lastName, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch orders route
app.get('/api/orders', async (req, res) => {
  try {
    const ordersCollection = db.collection('orders');
    const orders = await ordersCollection.find({}).toArray();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Place order route
app.post('/api/place-order', async (req, res) => {
  const { items, total, deliveryOptions } = req.body;

  const newOrder = { items, total, deliveryOptions, createdAt: new Date() };

  try {
    const ordersCollection = db.collection('orders');
    const result = await ordersCollection.insertOne(newOrder);
    res.status(201).json({ message: 'Order placed successfully', order: { _id: result.insertedId, ...newOrder } });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Error placing order' });
  }
});

// Fetch products route
app.get('/api/products', (req, res) => {
  const productsPath = path.join(__dirname, 'products.json');
  fs.readFile(productsPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error reading products' });

    try {
      const productsData = JSON.parse(data);
      res.json(productsData);
    } catch (parseError) {
      console.error('Error parsing products.json:', parseError);
      res.status(500).json({ message: 'Error parsing products' });
    }
  });
});

// Fetch a single product by ID
app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const productsPath = path.join(__dirname, 'products.json');
  fs.readFile(productsPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error reading products' });

    try {
      const productsData = JSON.parse(data);
      const product = productsData.find(p => p.id === productId);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (parseError) {
      console.error('Error parsing products.json:', parseError);
      res.status(500).json({ message: 'Error parsing products' });
    }
  });
});

// Delete a product
app.delete('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const productsPath = path.join(__dirname, 'products.json');
  fs.readFile(productsPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error reading products' });

    try {
      let productsData = JSON.parse(data);
      const productIndex = productsData.findIndex(p => p.id === productId);
      if (productIndex !== -1) {
        productsData.splice(productIndex, 1);
        fs.writeFile(productsPath, JSON.stringify(productsData, null, 2), 'utf8', (err) => {
          if (err) return res.status(500).json({ message: 'Error updating products' });
          res.status(200).json({ message: 'Product deleted successfully' });
        });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (parseError) {
      console.error('Error parsing products.json:', parseError);
      res.status(500).json({ message: 'Error parsing products' });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});