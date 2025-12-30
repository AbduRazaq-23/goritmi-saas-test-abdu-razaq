import Business from "../models/business.model.js";
import uploadBufferToCloudinary from "../utills/uploadOnCloudinary.js";
import { v2 as cloudinary } from "cloudinary";

//============================================
// CREATE BUSINESS PROFILE
//============================================

const createBusinessProfile = async (req, res) => {
  try {
    const { title, email, contact, location } = req.body;

    // Validate field
    if (!title || !email || !contact) {
      return res
        .status(400)
        .json({ message: "title, email, contact are required" });
    }

    //Create Business Profile
    const business = await Business.create({ title, email, contact, location });

    if (!business) {
      return res.status(404).json({ message: "error while creating profile" });
    }

    //Final response
    return res.status(201).json({ message: "profile created", business });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//============================================
// UPDATE BUSINESS PROFILE
//============================================

const updateBusinessProfile = async (req, res) => {
  try {
    const { title, email, contact, location } = req.body;

    // Validate field
    if (!title || !email || !contact) {
      return res
        .status(400)
        .json({ message: "title, email, contact field required" });
    }

    // Find the details
    const business = await Business.findOne();

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Set value
    business.title = title;
    business.email = email;
    business.contact = contact;
    business.location = location;

    // Then save business
    await business.save();

    // Final response
    return res.status(200).json({ message: "updated successfully", business });
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
      "business logo"
    );

    if (!uploadLogo) {
      return res.status(500).json({ message: "Error while uploading" });
    }

    // Find Business Profile
    const business = await Business.findOne();

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Delete old Logo
    if (business.logo?.publicId) {
      await cloudinary.uploader.destroy(business.logo.publicId);
    }

    business.logo = {
      url: uploadLogo.secure_url,
      publicId: uploadLogo.public_id,
    };

    await business.save();

    // Final response
    return res
      .status(201)
      .json({ message: "logo upload successfully", logo: business.logo });
  } catch (error) {
    return res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
};

//============================================
// GET BUSINESS PROFILE
//============================================

const getBusinessProfile = async (req, res) => {
  const businessProfile = await Business.findOne();

  if (!businessProfile) {
    return res.status(404).json({ message: "Profile not found" });
  }

  return res.status(200).json({ message: "Business Profile", businessProfile });
};

export {
  createBusinessProfile,
  updateBusinessProfile,
  uploadLogo,
  getBusinessProfile,
};
