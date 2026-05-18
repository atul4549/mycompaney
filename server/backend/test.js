import bcrypt from "bcryptjs";
import { Name } from "./src/models/Name.js";

export const submitName = async (req, res) => {
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
};
// import { Name } from './src/models/Name.js';

// GET all names
export const getAllUsers = async (req, res) => {
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
};

// GET /api/check-username/:username
export const checkUsername = async (req, res) => {
  try {
    const { username } = req.params;
    console.log(username);
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
};

export const getProfile = async (req, res) => {
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
};
