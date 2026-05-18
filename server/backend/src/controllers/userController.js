// import User from "../models/User.js";

// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().select("-password").sort({ name: 1 });

//     const transformedUsers = users.map((user) => ({
//       id: user._id,
//       name: user.name,
//       username: user.username,
//       email: user.email,
//       phone: user.phone || "",
//       website: user.website || "",
//       address: user.address || {
//         street: "",
//         suite: "",
//         city: "",
//         zipcode: "",
//       },
//       company: user.company || {
//         name: "",
//         catchPhrase: "",
//       },
//     }));

//     res.status(200).json({
//       success: true,
//       count: transformedUsers.length,
//       users: transformedUsers,
//     });
//   } catch (error) {
//     console.error("Get all users error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching users",
//     });
//   }
// };

// export const getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id)
//       .select("-password")
//       .populate("friends", "name email username profilePicture");

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const transformedUser = {
//       id: user._id,
//       name: user.name,
//       username: user.username,
//       email: user.email,
//       phone: user.phone || "",
//       website: user.website || "",
//       address: user.address || {
//         street: "",
//         suite: "",
//         city: "",
//         zipcode: "",
//       },
//       company: user.company || {
//         name: "",
//         catchPhrase: "",
//       },
//     };

//     res.status(200).json({
//       success: true,
//       user: transformedUser,
//     });
//   } catch (error) {
//     console.error("Get user by ID error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching user",
//     });
//   }
// };

// export const searchUsers = async (req, res) => {
//   try {
//     const { q } = req.query;

//     if (!q || q.trim() === "") {
//       return res.status(400).json({
//         success: false,
//         message: "Search query is required",
//       });
//     }

//     const users = await User.find({
//       $or: [
//         { name: { $regex: q, $options: "i" } },
//         { email: { $regex: q, $options: "i" } },
//         { username: { $regex: q, $options: "i" } },
//       ],
//     })
//       .select("-password")
//       .limit(20);

//     const transformedUsers = users.map((user) => ({
//       id: user._id,
//       name: user.name,
//       username: user.username,
//       email: user.email,
//     }));

//     res.status(200).json({
//       success: true,
//       users: transformedUsers,
//     });
//   } catch (error) {
//     console.error("Search users error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while searching users",
//     });
//   }
// };

// export const addFriend = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
//     const friend = await User.findById(req.params.id);

//     if (!friend) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     if (user.friends.includes(friend._id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Already friends",
//       });
//     }

//     user.friends.push(friend._id);
//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "Friend added successfully",
//     });
//   } catch (error) {
//     console.error("Add friend error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while adding friend",
//     });
//   }
// };

// export const removeFriend = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     user.friends = user.friends.filter(
//       (friendId) => friendId.toString() !== req.params.id,
//     );
//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "Friend removed successfully",
//     });
//   } catch (error) {
//     console.error("Remove friend error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while removing friend",
//     });
//   }
// };

// controllers/userController.js
// const User = require('../models/User');
import mongoose from 'mongoose';
import {Name as User} from '../models/Name.js';
// @desc    Get user by ID
// @route   GET /api/users/:userId
// @access  Private (requires authentication)
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate if userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Find user by ID and exclude sensitive fields
    const user = await User.findById(userId)
      .select('-password -refreshToken -resetPasswordToken -resetPasswordExpire')
      .lean();

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Optional: Check if the requesting user is authorized to view this profile
    // Uncomment if you want users to only view their own profile
    // if (req.user._id.toString() !== userId) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Not authorized to view this profile'
    //   });
    // }

    return res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching user data'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:userId
// @access  Private
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Prevent updating sensitive fields
    const forbiddenFields = ['password', 'role', '_id', 'email'];
    forbiddenFields.forEach(field => delete updates[field]);

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check authorization (only allow users to update their own profile)
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    return res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating user'
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/:userId
// @access  Private
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check authorization
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this account'
      });
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    // Optionally delete all related data (books, posts, etc.)
    // await Book.deleteMany({ userId: userId });
    // await Post.deleteMany({ author: userId });

    return res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting user'
    });
  }
};

export {
  getUserById,
  updateUser,
  deleteUser
};