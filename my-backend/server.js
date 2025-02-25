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
const JWT_SECRET = process.env.JWT_SECRET;






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
  origin: ['https://stormfather0.github.io', 'https://amazon-project-sta4.onrender.com', "http://127.0.0.1:5500", "http://localhost:5500",],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type, Authorization'],
  credentials: true
};
app.use(cors(corsOptions));  

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

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

// // Login route
// app.post('/api/login', async (req, res) => {
//     const { email, password } = req.body;
//     const user = users.find(user => user.email === email);
//     if (!user) {
//         return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//         return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const token = jwt.sign({ email: user.email }, 'your_jwt_secret_key', { expiresIn: '1h' });
//     res.json({ message: 'Login successful', token });
// });




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
    { type: String, 
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
      // Find the user in the database
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Compare provided password with stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Generate a JWT token
      const token = jwt.sign({ email: user.email }, 'secret_key', { expiresIn: '1h' });

      // ✅ Include the user's email in the response
      res.json({ message: 'Login successful', token, email: user.email,userId: user._id  });

  } catch (error) {
      console.error('Error during login:', error);
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
          password: hashedPassword
      });

      // Save the new user and get the result
      const savedUser = await newUser.save();

      res.status(201).json({ 
          message: 'User registered successfully',
          userId: savedUser._id  // Send the MongoDB-generated _id as the user ID
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











// Handle OPTIONS pre-flight request for CORS
app.options('/api/place-order', cors(corsOptions));


// Place order route
app.post('/api/place-order', cors(corsOptions), async (req, res) => {
    const { items, total, deliveryOptions } = req.body;
    

    console.log('Received order:', { items, total, deliveryOptions });

    const newOrder = {
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
app.post('/api/send-email', async (req, res) => {
    const { to, subject, text } = req.body;

    // Verify incoming request data
    if (!to || !subject || !text) {
        return res.status(400).send('Invalid email data');
    }

    // Email options
    const mailOptions = {
        from: 'sweetloveofmine95@gmail.com', // Sender's email
        to: to,
        subject: subject,
        text: text
    };

    try {
        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);

        // Send response back to frontend
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email');
    }
});


















const AUTH_SECRET = process.env.AUTH_SECRET;

const favouriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
}, { timestamps: true });

const Favourite = mongoose.model('Favourite', favouriteSchema);

// Middleware for authenticating JWT token
// Middleware for authenticating JWT token
function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
      return res.status(401).json({ message: 'Authentication required' }); // Missing token
  }

  // Verify token
  jwt.verify(token, process.env.AUTH_SECRET, (err, user) => {
      if (err) {
          return res.status(403).json({ message: 'Forbidden' });  // Token verification failed
      }

      req.user = user; // Attach the user object to the request

      // Ensure the userId in the token matches the userId in the body of the request
      if (req.body.userId && req.body.userId !== user.id) {
          return res.status(403).json({ message: 'Forbidden: User mismatch' });
      }

      next();  // Proceed to the next middleware or route handler
  });
}

// Route to add a product to favorites
app.post('/api/favourites', authenticateToken, async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
      return res.status(400).json({ message: 'User ID and Product ID are required' });
  }

  try {
      // Check if product is already in the user's favorites
      const existingFavourite = await Favourite.findOne({ userId, productId });
      if (existingFavourite) {
          return res.status(400).json({ message: 'Product is already in your favorites' });
      }

      // Add new favorite
      const newFavourite = new Favourite({ userId, productId });
      await newFavourite.save();

      res.status(201).json({ message: 'Favourite added successfully', favourite: newFavourite });
  } catch (error) {
      console.error('Error adding favourite:', error);
      res.status(500).json({ message: 'Error adding favourite' });
  }
});

// Route to remove a product from favorites
app.delete('/api/favourites', authenticateToken, async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
      return res.status(400).json({ message: 'User ID and Product ID are required' });
  }

  try {
      const favourite = await Favourite.findOneAndDelete({ userId, productId });

      if (!favourite) {
          return res.status(404).json({ message: 'Favourite not found' });
      }

      res.status(200).json({ message: 'Favourite removed successfully' });
  } catch (error) {
      console.error('Error removing favourite:', error);
      res.status(500).json({ message: 'Error removing favourite' });
  }
});

// Sample product route (replace with your actual product schema and logic)
app.get('/api/products', async (req, res) => {
  try {
      const products = await Product.find();
      res.json(products);
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Error fetching products' });
  }
});



















// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


// const path = require('path');


