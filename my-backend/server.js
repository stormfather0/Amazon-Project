import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path'; 
import { fileURLToPath } from 'url'; 
import { dirname } from 'path'; 
import { MongoClient, ObjectId } from 'mongodb';
import fs from 'fs';
import session from 'express-session';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = 'b5d4c974803809b4d3edc41b0db5fadc056208cbde2b336362f723772436a9b9'; // Defined JWT_SECRET directly here
const router = express.Router(); 

console.log(JWT_SECRET); // Should output the JWT secret from your .env file

import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';

const app = express();
const PORT = 3000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 50000,
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.log('Error connecting to MongoDB:', err);
});

const uri = 'mongodb+srv://Madison:Madison123@cluster0.lbkfd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);
let db;
let ordersCache = [];

async function connectToDatabase() {
    try {
        await client.connect();
        db = client.db('Cluster0');
        console.log('Connected to MongoDB');
        ordersCache = await db.collection('orders').find({}).toArray();
        console.log('Loaded orders from database:', ordersCache);
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

connectToDatabase();

const corsOptions = {
  origin: ['https://stormfather0.github.io', 'https://amazon-project-sta4.onrender.com', "http://127.0.0.1:5500", "http://localhost:5500"],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); 
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self' 'unsafe-inline'; img-src 'self' data:;"
    );
    next();
});

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });

      res.json({ message: 'Login successful', token, email: user.email, userId: user._id });
  } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
          firstName,
          lastName,
          email,
          password: hashedPassword
      });

      const savedUser = await newUser.save();

      res.status(201).json({
          message: 'User registered successfully',
          userId: savedUser._id
      });
  } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/place-order', cors(corsOptions), async (req, res) => {
    const { items, total, deliveryOptions } = req.body;

    console.log('Received order:', { items, total, deliveryOptions });

    const newOrder = { items, total, deliveryOptions, createdAt: new Date() };

    try {
        const ordersCollection = db.collection('orders');
        const result = await ordersCollection.insertOne(newOrder);
        ordersCache.push({ _id: result.insertedId, ...newOrder });

        res.status(201).json({
            message: 'Order placed successfully',
            order: { _id: result.insertedId, ...newOrder },
        });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Error placing order' });
    }
});

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

app.delete('/api/orders/:id', async (req, res) => {
    const orderId = req.params.id;

    try {
        const ordersCollection = db.collection('orders');
        const result = await ordersCollection.deleteOne({ _id: new ObjectId(orderId) });

        if (result.deletedCount === 1) {
            ordersCache = ordersCache.filter(order => order._id.toString() !== orderId);
            res.status(200).json({ message: 'Order deleted successfully' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Error deleting order' });
    }
});

app.get('/api/products', (req, res) => {
    const productsPath = path.join(__dirname, 'products.json');

    fs.readFile(productsPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading products.json:', err);
            return res.status(500).json({ message: 'Error reading products' });
        }

        try {
            const productsData = JSON.parse(data);
            res.json(productsData);
        } catch (parseError) {
            console.error('Error parsing products.json:', parseError);
            res.status(500).json({ message: 'Error parsing products' });
        }
    });
});

app.delete('/api/products/:id', (req, res) => {
    const productId = req.params.id;

    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read products file' });
        }

        let products = JSON.parse(data);
        const productIndex = products.findIndex(product => product.id === productId);

        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }

        products.splice(productIndex, 1); // Remove the product from the array

        fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to save updated products file' });
            }
            res.status(200).json({ message: 'Product deleted successfully' });
        });
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});