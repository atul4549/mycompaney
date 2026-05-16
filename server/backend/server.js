import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./src/config/database.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import socketHandler from "./src/sockets/socketHandler.js";
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  },
});

app.set("io", io);

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credentials: true,
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

import { Name } from './src/models/Name.js';

app.post('/api/submit-name', async (req, res) => {
    try {
        const { name, username, timestamp, source } = req.body;

        // Validate inputs
        if (!name || !username) {
        return res.status(400).json({
            success: false,
            error: 'Name and username are required'
        });
        }
        
         // Check if username already exists
        const existingUser = await Name.findOne({ 
        username: username.toLowerCase() 
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: 'Username already taken'
            });
            }
            

        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Valid name is required' 
            });
        }
        
        // const data = await Name.create({ name }); // Note: lowercase 'c' if following conventions
        // console.log(`Received name: ${name}`);
        // Create new user
        const newUser = new Name({
            name: name.trim(),
            username: username.toLowerCase().trim(),
            timestamp: timestamp || new Date(),
            source: source || 'coming_soon_page'
        });
        
        await newUser.save();

        return res.status(200).json({ 
            success: true,
            data: {
                user: newUser,
                message: 'Successfully joined waitlist'
            }
        });
        
    } catch (error) {
        console.error('Error in /api/submit-name:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// import { Name } from './src/models/Name.js';

// GET all names
app.get('/api/users', async (req, res) => {
    try {
        const names = await Name.find(); // or Name.findAll() depending on your ORM
        
        return res.status(200).json({
            success: true,
            count: names.length,
            data: names
        });
        
    } catch (error) {
        console.error('Error in GET /api/names:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// GET /api/check-username/:username
app.get('/api/check-username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_.]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        available: false,
        error: 'Username can only contain letters, numbers, underscore, and dot'
      });
    }
    
    // Check minimum length
    if (username.length < 3) {
      return res.status(400).json({
        available: false,
        error: 'Username must be at least 3 characters long'
      });
    }
    
    // Check if username exists in database
    const existingUser = await Name.findOne({ 
      username: username.toLowerCase() 
    });
    
    // Return response
    return res.status(200).json({
      available: !existingUser,
      username: username,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error checking username:', error);
    return res.status(500).json({
      available: false,
      error: 'Internal server error'
    });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use(errorHandler);

// Socket.io handling
socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
