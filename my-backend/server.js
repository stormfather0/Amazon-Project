import express from 'express';
import cors from 'cors'; 
// import bcrypt from 'bcrypt';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path'; 
import { fileURLToPath } from 'url'; 
import { dirname } from 'path'; 
import { MongoClient, ObjectId } from 'mongodb';
import fs from 'fs';
// import { API_BASE_URL } from "./backend-config.js";



import session from 'express-session';
// import User from './models/User.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


const MONGO_URI = process.env.MONGO_URI;
// const JWT_SECRET = process.env.JWT_SECRET;
const AUTH_SECRET = process.env.AUTH_SECRET;
const router = express.Router(); 

const JWT_SECRET  = 'b5d4c974803809b4d3edc41b0db5fadc056208cbde2b336362f723772436a9b9';





console.log(JWT_SECRET); // Should output the JWT secret from your .env file

import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
// const nodemailer = require('nodemailer');
// const bodyParser = require('body-parser');
// const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;




// app.use(
//     session({
//       secret: 'sb5d4c974803809b4d3edc41b0db5fadc056208cbde2b336362f723772436a9b9',
//       resave: false,
//       saveUninitialized: true,
//       cookie: { secure: false }, // Set to true if using HTTPS
//     })
//   );
  

// import dotenv from 'dotenv';
// dotenv.config();



// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log('Error connecting to MongoDB:', err));


  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 50000,  // You can increase this timeout if needed
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.log('Error connecting to MongoDB:', err);
  });

// MongoDB connection URI (replace with your own)

// MongoDB connection URI 

const uri = process.env.MONGO_URI
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

// Content Security Policy header middleware
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self' 'unsafe-inline'; img-src 'self' data:;"
    );
    next();
});


const users = [
    {
        email: 'user@example.com',
        password: '$2b$10$qz2.ulbwOpPNxoxEPLN8RubrNItlwJ1Tl7Uz5IrW0WLC/TNYwZ.6y' 
    }
];





//New
// User Schema and Model
// User Schema
const userSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    favorites: 
    { type: [String],
       default: [] } 

});
  const User = mongoose.model('User', userSchema);
  
  // Create the User model
//   const User = mongoose.model('User', userSchema);
// const User = mongoose.model('User', userSchema);
// export default User;
//   const User = mongoose.model('User', userSchema)

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });

      if (!user) {
          console.log('❌ User not found:', email);
          return res.status(400).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          console.log('❌ Incorrect password for:', email);
          return res.status(400).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1000h' });

      console.log('✅ Logging in user:', email, '| User ID:', user._id); // Debugging

      res.json({ 
          token, 
          email: user.email, 
          firstName: user.firstName, 
          lastName: user.lastName 
      });
  } catch (error) {
      console.error('❌ Error logging in:', error);
      res.status(500).json({ message: 'Server error' });
  }
});
// Register route
// Register route
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
          password: hashedPassword,
          favorites: [] // Initialize an empty favorites array
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

// Register route
// Ensure this route is correctly set up and it's placed inside the app.use or at the top level of your server
// app.post('/api/register', async (req, res) => {
//     const { firstName, lastName, email, password } = req.body;
    
//     // Log the incoming request body
//     console.log('Request body:', req.body);
    
//     try {
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newUser = new User({
//             firstName,
//             lastName,
//             email,
//             password: hashedPassword
//         });

//         // Log the user object before saving to MongoDB
//         console.log('Saving user:', newUser);

//         await newUser.save();

//         res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//         console.error('Error during registration:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });





const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {
      const verified = jwt.verify(token, JWT_SECRET);
      req.user = verified; // Attach user info to request object
      next();
  } catch (err) {
      return res.status(403).json({ message: 'Invalid Token' });
  }
};
















// Handle OPTIONS pre-flight request for CORS
app.options('/api/place-order', cors(corsOptions));


// Place order route
// Place order route
app.post('/api/place-order', cors(corsOptions), authenticateToken, async (req, res) => {
  const { items, total, deliveryOptions } = req.body;

  // Get user data from the authenticated token
  const { id, userName, email } = req.user;

  console.log('Received order from:', { id, userName, email });
  console.log('Order details:', { items, total, deliveryOptions });

  const newOrder = {
      userId: id,         // Store user ID
      userName: userName, // Store user name
      email: email,       // Store user email
      items,
      total,
      deliveryOptions,
      createdAt: new Date()
  };

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

// // Fetch orders route
// app.get('/api/orders', async (req, res) => {
//     try {
//         const ordersCollection = db.collection('orders');
//         const orders = await ordersCollection.find({}).toArray();

//         res.json(orders);
//     } catch (error) {
//         console.error('Error fetching orders:', error);
//         res.status(500).json({ message: 'Error fetching orders' });
//     }
// });



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





// Delete order route
app.delete('/api/orders/:id', async (req, res) => {
    const orderId = req.params.id;

    try {
        const ordersCollection = db.collection('orders');
        const result = await ordersCollection.deleteOne({ _id: new ObjectId(orderId) });

        if (result.deletedCount === 1) {
            // Remove from cache
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











// Fetch products route
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


//WORKS


app.get('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    const filePath = path.join(__dirname, 'products.json');
  
    // Log the incoming ID to check if it's correct
    console.log(`Received ID: ${productId}`);
  
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Error reading the file' });
      }
  
      let products;
      try {
        products = JSON.parse(data); // Parse the JSON data
      } catch (parseError) {
        return res.status(500).json({ error: 'Error parsing JSON data' });
      }
  
      // Log the parsed products to check the content
      console.log('Parsed Products:', products);
  
      // Find the product by ID (trim to ensure no extra spaces)
      const product = products.find(p => p.id && p.id.trim() === productId.trim());
  
      if (product) {
        console.log('Found product:', product); // Log the found product
        return res.json(product);
      } else {
        console.log(`Product with ID ${productId} not found`);
        return res.status(404).json({ error: 'Product not found' });
      }
    });
  });
  



  //

// Use CORS for frontend requests
// app.use(cors({
//     origin: 'http://127.0.0.1:5500',
//     methods: ['POST', 'GET', 'OPTIONS', 'DELETE'], 
//     allowedHeaders: ['Content-Type'], 
//   }));
  
  app.use(express.json());
  
  // Path to products JSON file
  const productsFilePath = path.join(__dirname, 'products.json');
  
  // Fetch all products
  app.get('/api/products', (req, res) => {
    fs.readFile(productsFilePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to read products file' });
      }
      res.json(JSON.parse(data)); // Send products to frontend
    });
  });
  
//   // Delete a product
//   app.delete('/api/products/:id', (req, res) => {
//     const productId = req.params.id;
  
//     fs.readFile(productsFilePath, 'utf8', (err, data) => {
//       if (err) {
//         return res.status(500).json({ error: 'Failed to read products file' });
//       }
  
//       let products = JSON.parse(data);
//       const productIndex = products.findIndex(product => product.id === productId);
  
//       if (productIndex === -1) {
//         return res.status(404).json({ error: 'Product not found' });
//       }
  
//       products.splice(productIndex, 1); // Remove the product from the array
  
//       fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), 'utf8', (err) => {
//         if (err) {
//           return res.status(500).json({ error: 'Failed to save updated product' });
//         }
//         res.status(200).json({ message: 'Product deleted successfully' });
//       });
//     });
//   });
  





// Delete a product
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






// Handle PUT request to update a product
app.put('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    const updatedProduct = req.body;

    // Read the products file
    fs.readFile(productsFilePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to read products file' });
      }

      let products = JSON.parse(data);
      const productIndex = products.findIndex((product) => product.id === productId);

      if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Check if count is passed and move it into the rating object
      if (updatedProduct.count !== undefined) {
        updatedProduct.rating = updatedProduct.rating || {}; // Ensure rating object exists
        updatedProduct.rating.count = updatedProduct.count;  // Add count inside the rating object
        delete updatedProduct.count;  // Remove count from the top level
      }

      // Update the product with the new information
      products[productIndex] = {
        ...products[productIndex],
        ...updatedProduct,
      };

      // Write the updated products back to the file
      fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), 'utf8', (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to save updated product' });
        }
        res.status(200).json({ message: 'Product updated successfully' });
      });
    });
});









// 




// Serve static images from the external 'images' directory
app.use('/images', express.static(path.join(__dirname, '..', 'images')));

// Log requests for images (optional)
app.use('/images', (req, res, next) => {
    console.log(`Request for ${req.url}`);
    next();
});



// Create a transporter object
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
  }
});



// Create a transporter object
// const transporter = nodemailer.createTransport({
//     service: 'gmail', // Use your email provider, e.g., Gmail, Outlook
//     auth: {
//         user: 'sweetloveofmine95@gmail.com', // Replace with your email
//         pass: 'ykdk vpny ppgr rhrn'  // Replace with your email password or app-specific password
//     }
// });

// Function to send email
// Function to send email

// Route to handle email sending
// app.post('/api/send-email', async (req, res) => {
//     const { to, subject, text } = req.body;

//     // Verify incoming request data
//     if (!to || !subject || !text) {
//         return res.status(400).send('Invalid email data');
//     }

//     // Email options
//     const mailOptions = {
//         from: 'sweetloveofmine95@gmail.com', // Sender's email
//         to: to,
//         subject: subject,
//         text: text
//     };

//     try {
//         // Send email
//         const info = await transporter.sendMail(mailOptions);
//         console.log('Email sent:', info.response);

//         // Send response back to frontend
//         res.status(200).send('Email sent successfully');
//     } catch (error) {
//         console.error('Error sending email:', error);
//         res.status(500).send('Failed to send email');
//     }
// });






// Middleware to verify JWT and check if the user is verified
const verifyUser = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  console.log('Token received:', token);  // Log the received token

  if (!token) {
      return res.status(400).json({ error: 'Authentication token is required.' });
  }

  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('Decoded token:', decoded);  // Log the decoded token

      const user = await User.findOne({ email: decoded.email });  // Use email to find user, not ID

      if (!user) {
          return res.status(404).json({ error: 'User not found.' });
      }

      if (!user.isVerified) {
          return res.status(403).json({ isVerified: false, message: 'User is not verified.' });
      }

      req.user = user;
      next();
  } catch (error) {
      console.error('Verification error:', error);
      res.status(400).json({ error: 'Invalid or expired token.' });
  }
};

// Example route to verify user
app.get('/api/verify', verifyUser, (req, res) => {
  res.json({ isVerified: true, message: 'User is verified.' });
});







// Fetch user details
app.get('/api/user', authenticateToken, async (req, res) => {
  try {
      console.log('Decoded User:', req.user); // Debugging

      const user = await User.findById(req.user.id).select('-password'); // ✅ Use `req.user.id`
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      return res.json({ firstName: user.firstName, lastName: user.lastName, email: user.email });
  } catch (error) {
      console.error('❌ Error fetching user:', error);
      return res.status(500).json({ message: 'Server error' });
  }
});





//Favourites
app.get('/api/favorites', authenticateToken, async (req, res) => {
  try {
      console.log('✅ User authenticated:', req.user);

      const user = await User.findById(req.user.id);
      console.log('🔍 Fetched user from DB:', user);

      if (!user) {
          console.error('❌ User not found in database!');
          return res.status(404).json({ message: 'User not found' });
      }

      if (!user.favorites || user.favorites.length === 0) {
          console.warn('⚠️ User has no favorites.');
          return res.json({ id: user._id, message: "You don't have favourites" });
      }

      return res.json({ id: user._id, favorites: user.favorites });
  } catch (error) {
      console.error('❌ Error fetching favorites:', error);
      return res.status(500).json({ message: 'Server error' });
  }
});



//=============================

// ✅ Add Favorite
app.post('/api/favorites/add', authenticateToken, async (req, res) => {
  try {
      const { productId } = req.body;
      if (!productId) return res.status(400).json({ error: 'Product ID is required' });

      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      // Add the product to favorites if it's not already there
      if (!user.favorites.includes(productId)) {
          user.favorites.push(productId);
          await user.save();
      }

      res.json({ message: 'Product added to favorites', favorites: user.favorites });
  } catch (error) {
      console.error('❌ Error adding favorite:', error);
      res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Remove Favorite
app.delete('/api/favorites/remove', authenticateToken, async (req, res) => {
  try {
      const { productId } = req.body;
      if (!productId) return res.status(400).json({ error: 'Product ID is required' });

      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      user.favorites = user.favorites.filter(fav => fav !== productId);
      await user.save();

      res.json({ message: 'Product removed from favorites', favorites: user.favorites });
  } catch (error) {
      console.error('❌ Error removing favorite:', error);
      res.status(500).json({ error: 'Server error' });
  }
});
















//Favourites for test










// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


// const path = require('path');


