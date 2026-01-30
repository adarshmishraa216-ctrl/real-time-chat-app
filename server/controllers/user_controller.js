// controllers/user_controller.js

import User from "../models/user.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";

// ===============================
// Signup a new user
// ===============================
 export const signup = async (req, res) => {
  const { fullname, email, password, bio } = req.body;

  try {
    if (!fullname || !email || !password) {
      return res.json({ success: false, message: "Missing details" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Account already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      bio,
      profilepic: "",
    });

    const token = generateToken(newUser._id);

    res.json({
      success: true,
      user: {
        id: newUser._id,
        fullName: newUser.fullname,
        email: newUser.email,
        bio: newUser.bio,
        profilePic: newUser.profilepic || null,
      },
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ===============================
// Login a user
// ===============================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullname,
        email: user.email,
        bio: user.bio,
        profilePic: user.profilepic || null,
      },
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ===============================
// Check authentication
// ===============================
export const checkauth = (req, res) => {
  if (!req.user) {
    return res.json({ success: false, message: "Not authenticated" });
  }

  res.json({
    success: true,
    user: {
      id: req.user._id,
      fullName: req.user.fullname,
      email: req.user.email,
      bio: req.user.bio,
      profilePic: req.user.profilepic || null,
    },
  });
};

// ===============================
// Update user profile
// ===============================
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    console.log("-> Update Profile Request Received");
    console.log("   UserId:", req.user._id);
    console.log("   Has ProfilePic:", !!profilePic);
    
    const userId = req.user._id;
    let updatedUser;

    if (profilePic) {
      let newProfileUrl = null;
      try {
        console.log("-> Uploading to Cloudinary...");
        const upload = await cloudinary.uploader.upload(profilePic);
        newProfileUrl = upload.secure_url;
        console.log("-> Cloudinary Upload Success:", newProfileUrl);
      } catch (e) {
        console.log("CLOUDINARY UPLOAD ERROR:", e);
        throw new Error("Cloudinary upload failed");
      }
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilepic: newProfileUrl, bio, fullname: fullName },
        { new: true }
      ).select("-password");
    } else {
      console.log("-> Updating without image");
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullname: fullName },
        { new: true }
      ).select("-password");
    }

    if (!updatedUser) {
      console.log("-> User not found in DB");
      return res.json({ success: false, message: "User not found" });
    }

    console.log("-> DB Update Success:", updatedUser.fullname);

    res.json({
      success: true,
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullname,
        email: updatedUser.email,
        bio: updatedUser.bio,
        profilePic: updatedUser.profilepic || null,
      },
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error.message);
    res.json({ success: false, message: error.message });
  }
};
