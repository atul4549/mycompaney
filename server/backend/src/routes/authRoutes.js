// // import express from "express";
// // import { body } from "express-validator";
// // import {
// //   register,
// //   login,
// //   logout,
// //   getMe,
// //   updateProfile,
// //   changePassword,
// // } from "../controllers/authController.js";
// // import { protect } from "../middleware/auth.js";

// // const router = express.Router();

// // const registerValidation = [
// //   body("name").notEmpty().withMessage("Name is required").trim(),
// //   body("email")
// //     .isEmail()
// //     .withMessage("Please enter a valid email")
// //     .normalizeEmail(),
// //   body("password")
// //     .isLength({ min: 6 })
// //     .withMessage("Password must be at least 6 characters"),
// // ];

// // const loginValidation = [
// //   body("email")
// //     .isEmail()
// //     .withMessage("Please enter a valid email")
// //     .normalizeEmail(),
// //   body("password").notEmpty().withMessage("Password is required"),
// // ];

// // router.post("/register", registerValidation, register);
// // router.post("/login", loginValidation, login);
// // router.post("/logout", protect, logout);
// // router.get("/me", protect, getMe);
// // router.put("/profile", protect, updateProfile);
// // router.put("/change-password", protect, changePassword);

// // export default router;

import express from "express";
// import User from "../models/User.js";
import { Name as User } from "../models/Name.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
};

router.post("/register", async (req, res) => {
  try {
    const { name, username, password } = req.body;

    if (!username || !name || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password should be at least 6 characters long" });
    }

    if (username.length < 3) {
      return res.status(400).json({ message: "Username should be at least 3 characters long" });
    }

//     // check if user already exists
//     const existingEmail = await User.findOne({ email });
//     if (existingEmail) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // get random avatar
    const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      // email,
      name,
      username,
      password: hashedPassword,
      profileImage,
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        // email: user.email,
        name: user.name,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("Error in register route", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ message: "All fields are required" });

    // check if user exists
    const user = await User.findOne({ username }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials (username)" });

//     // check if password is correct
    // const isPasswordCorrect = await user.comparePassword(password);
    // if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });
// Use bcrypt directly
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials (password)" });
    }
    const token = generateToken(user._id);

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        // email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("Error in login route", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;