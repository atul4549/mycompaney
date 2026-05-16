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
import bcrypt from "bcryptjs";
dotenv.config();

import {protect as authMiddleware} from "./src/middleware/auth.js";

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

import { Name } from "./src/models/Name.js";

// app.post('/api/submit-name', async (req, res) => {
//     try {
//         const { name, username, timestamp, source, password } = req.body;

//         // Validate inputs
//         if (!name || !username || !password) {
//         return res.status(400).json({
//             success: false,
//             error: 'Name and username are required'
//         });
//         }

//          // Check if username already exists
//         const existingUser = await Name.findOne({
//         username: username.toLowerCase()
//         });

//         if (existingUser) {
//             return res.status(409).json({
//                 success: false,
//                 error: 'Username already taken'
//             });
//             }

//         if (!name || typeof name !== 'string' || name.trim().length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Valid name is required'
//             });
//         }

//         // const data = await Name.create({ name }); // Note: lowercase 'c' if following conventions
//         // console.log(`Received name: ${name}`);
//         // Create new user
//         const newUser = new Name({
//             name: name.trim(),
//             username: username.toLowerCase().trim(),
//             timestamp: timestamp || new Date(),
//             source: source || 'coming_soon_page'
//         });

//         await newUser.save();

//         return res.status(200).json({
//             success: true,
//             data: {
//                 user: newUser,
//                 message: 'Successfully joined waitlist'
//             }
//         });

//     } catch (error) {
//         console.error('Error in /api/submit-name:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Internal server error'
//         });
//     }
// });
app.post("/api/submit-name", async (req, res) => {
  try {
    const { name, username, timestamp, source, password } = req.body;

    // Validate inputs - Fix: Include password in validation
    if (!name || !username || !password) {
      return res.status(400).json({
        success: false,
        error: "Name, username, and password are required",
      });
    }

    // Validate name
    if (typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Valid name is required",
      });
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_.]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        success: false,
        message:
          "Username can only contain letters, numbers, underscore, and dot",
      });
    }

    // Validate password strength
    if (typeof password !== "string" || password.trim().length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if username already exists
    const existingUser = await Name.findOne({
      username: username.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "Username already taken",
      });
    }

    // Hash the password before storing (IMPORTANT for security)
    // const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user with password
    const newUser = new Name({
      name: name.trim(),
      username: username.toLowerCase().trim(),
      password: hashedPassword, // Store the hashed password, not plain text!
      timestamp: timestamp || new Date(),
      source: source || "coming_soon_page",
    });

    await newUser.save();

    // Don't send back the password in the response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(200).json({
      success: true,
      data: {
        user: userResponse,
        message: "Successfully joined waitlist",
      },
    });
  } catch (error) {
    console.error("Error in /api/submit-name:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
// import { Name } from './src/models/Name.js';

// GET all names
app.get("/api/users", async (req, res) => {
  try {
    const names = await Name.find(); // or Name.findAll() depending on your ORM

    return res.status(200).json({
      success: true,
      count: names.length,
      data: names,
    });
  } catch (error) {
    console.error("Error in GET /api/names:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// GET /api/check-username/:username
app.get("/api/check-username/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_.]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        available: false,
        error:
          "Username can only contain letters, numbers, underscore, and dot",
      });
    }

    // Check minimum length
    if (username.length < 3) {
      return res.status(400).json({
        available: false,
        error: "Username must be at least 3 characters long",
      });
    }

    // Check if username exists in database
    const existingUser = await Name.findOne({
      username: username.toLowerCase(),
    });

    // Return response
    return res.status(200).json({
      available: !existingUser,
      username: username,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error checking username:", error);
    return res.status(500).json({
      available: false,
      error: "Internal server error",
    });
  }
});

app.get("/api/profile", authMiddleware, async (req, res) => {
  try {
    const user = await Name.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


// Update user profile
// router.put('/profile', authMiddleware, async (req, res) => {
//   try {
//     const { name, bio, email } = req.body;
    
//     const updates = {};
//     if (name) updates.name = name.trim();
//     if (bio !== undefined) updates.bio = bio.trim();
//     if (email) updates.email = email.toLowerCase().trim();
    
//     const user = await User.findByIdAndUpdate(
//       req.userId,
//       { ...updates, updatedAt: new Date() },
//       { new: true, runValidators: true }
//     ).select('-password');
    
//     res.json({ success: true, data: user });
//   } catch (error) {
//     console.error('Error updating profile:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // Change password
// router.post('/change-password', authMiddleware, async (req, res) => {
//   try {
//     const { oldPassword, newPassword } = req.body;
    
//     const user = await User.findById(req.userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }
    
//     // Verify old password
//     const isValidPassword = await bcrypt.compare(oldPassword, user.password);
//     if (!isValidPassword) {
//       return res.status(401).json({ success: false, message: 'Current password is incorrect' });
//     }
    
//     // Hash new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     await user.save();
    
//     res.json({ success: true, message: 'Password changed successfully' });
//   } catch (error) {
//     console.error('Error changing password:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // Delete account
// router.delete('/account', authMiddleware, async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.userId);
//     res.json({ success: true, message: 'Account deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting account:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });



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
// git add . && git commit -m "pass input added in auth page and profile page added "