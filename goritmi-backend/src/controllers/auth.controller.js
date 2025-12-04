import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utills/generateToken.js";

// ===============================
// 📌 REGISTER USER
// ===============================
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check if user exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // options for cookies
    const options = {
      httpsOnly: true,
      secure: true,
    };
    const token = generateToken(user._id);

    return res
      .status(201)
      .cookie("token", token, options)
      .json({
        message: "register succesfully",
        user: { id: user._id, name: user.name, email: user.email },
        token,
      });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
// ===============================
// 📌 LOGIN USER
// ===============================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    // Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // options for cookies
    const options = {
      httpsOnly: true,
      secure: true,
    };

    // generate token
    const token = generateToken(user._id);

    return res
      .status(201)
      .cookie("token", token, options)
      .json({
        message: "login successful",
        user: { id: user._id, name: user.name, email: user.email },
        token,
      });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
// ===============================
// 📌 GET LOGGED-IN USER PROFILE
// ===============================
const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    return res.status(200).json({
      message: "getProfile succesfully",
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error("Profile Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
// ===============================
// 📌 LOGOUT USER
// ===============================
const logout = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "unauthorized request" });
    }
    const options = {
      httpsOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .clearCookie("token", options)
      .json({ message: "logout succesfully" });
  } catch (error) {
    console.log("logout error", error);
    return res.status(500).json({ message: "server error" });
  }
};
// ===============================
// 📌 UPDATE USER
// ===============================
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "all field are required" });
    }
    if (!req.user) {
      return res.status(401).json({ message: "unauthorized request" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          name,
          email,
        },
      },
      { new: true }
    );
    if (!user) {
      return res.status(400).json({ message: "unauthorized request" });
    }
    return res.status(200).json({ message: "updated successfully" });
  } catch (error) {
    console.log("update error", error);
    return res.status(500).json({ message: "server error" });
  }
};
// ===============================
// 📌 UPDATE PASSWORD
// ===============================
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "all field are required" });
    }
    if (!req.user) {
      return res.status(401).json({ message: "unauthorized request" });
    }
    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "incorrect old password" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(
      user?._id,
      {
        $set: {
          password: hashedPassword,
        },
      },
      { new: true }
    );
    if (!user) {
      return res.status(400).json({ message: "unauthorized request" });
    }
    return res.status(200).json({ message: "updated successfully" });
  } catch (error) {
    console.log("update error", error);
    return res.status(500).json({ message: "server error" });
  }
};
// ===============================
// 📌 UPDATE USER
// ===============================
const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(400).json({ message: "unauthorized request" });
    }
    return res
      .status(200)
      .json({ message: "get all users succesfully", users });
  } catch (error) {
    console.log("update error", error);
    return res.status(500).json({ message: "server error" });
  }
};
// ===============================
// 📌 DELETE BY ADMIN USER
// ===============================
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "no id" });
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    return res.status(200).json({ message: "deleted succesfully" });
  } catch (error) {
    console.log("error deleting user", error);
    return res.status(500).json({ message: "server error" });
  }
};

export {
  register,
  login,
  getProfile,
  logout,
  updateProfile,
  updatePassword,
  getAllUser,
  deleteUser,
};
