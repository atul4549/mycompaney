import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ name: 1 });

    const transformedUsers = users.map((user) => ({
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone || "",
      website: user.website || "",
      address: user.address || {
        street: "",
        suite: "",
        city: "",
        zipcode: "",
      },
      company: user.company || {
        name: "",
        catchPhrase: "",
      },
    }));

    res.status(200).json({
      success: true,
      count: transformedUsers.length,
      users: transformedUsers,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("friends", "name email username profilePicture");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const transformedUser = {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone || "",
      website: user.website || "",
      address: user.address || {
        street: "",
        suite: "",
        city: "",
        zipcode: "",
      },
      company: user.company || {
        name: "",
        catchPhrase: "",
      },
    };

    res.status(200).json({
      success: true,
      user: transformedUser,
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user",
    });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { username: { $regex: q, $options: "i" } },
      ],
    })
      .select("-password")
      .limit(20);

    const transformedUsers = users.map((user) => ({
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
    }));

    res.status(200).json({
      success: true,
      users: transformedUsers,
    });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while searching users",
    });
  }
};

export const addFriend = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const friend = await User.findById(req.params.id);

    if (!friend) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.friends.includes(friend._id)) {
      return res.status(400).json({
        success: false,
        message: "Already friends",
      });
    }

    user.friends.push(friend._id);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Friend added successfully",
    });
  } catch (error) {
    console.error("Add friend error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding friend",
    });
  }
};

export const removeFriend = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.friends = user.friends.filter(
      (friendId) => friendId.toString() !== req.params.id,
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: "Friend removed successfully",
    });
  } catch (error) {
    console.error("Remove friend error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while removing friend",
    });
  }
};
