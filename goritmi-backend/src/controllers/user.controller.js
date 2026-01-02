import User from "../models/user.model.js";
import Invoice from "../models/invoice.model.js";

// ===============================
// 📌 GET USER PROFILE
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
        contact: req.user.contact,
        location: req.user.location,
      },
    });
  } catch (error) {
    console.error("Profile Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// 📌 UPDATE USER
// ===============================
const updateProfile = async (req, res) => {
  try {
    const { name, contact, location } = req.body;

    // VALIDATE BODY FIELD
    if (!name || !contact) {
      return res.status(400).json({ message: "all field are required" });
    }

    // CHECK IS USER
    if (!req.user) {
      return res.status(401).json({ message: "unauthorized request" });
    }

    // UPDATE DETAILS IN DB
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          name,
          contact,
          location,
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({ message: "unauthorized request" });
    }

    // RESPONSE
    return res.status(200).json({ message: "updated successfully", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
    const invoice = await Invoice.deleteMany({ userId: id });

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
// ===============================
// 📌 ISACTIVE OR DEACTIVATE
// ===============================
const toggleStatusUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "user id not found" });
    }
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    user.isActive = !user.isActive;
    await user.save();
    return res.status(200).json({
      message: user.isActive ? "User Activated" : "User Deactivated",
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: "server error", error });
  }
};

//============================================
// UPLOAD BUSINESS PROFILE LOGO
//============================================

const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    // Upload on Cloudinary
    const uploadLogo = await uploadBufferToCloudinary(
      req.file.buffer,
      "user logo"
    );

    if (!uploadLogo) {
      return res.status(500).json({ message: "Error while uploading" });
    }

    // Find User Profile
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    // Delete old Logo
    if (user.logo?.publicId) {
      await cloudinary.uploader.destroy(user.logo.publicId);
    }

    user.logo = {
      url: uploadLogo.secure_url,
      publicId: uploadLogo.public_id,
    };

    await user.save();

    // Final response
    return res
      .status(201)
      .json({ message: "logo upload successfully", logo: user.logo });
  } catch (error) {
    return res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
};

export {
  getProfile,
  updateProfile,
  getAllUser,
  deleteUser,
  toggleStatusUser,
  uploadLogo,
};
