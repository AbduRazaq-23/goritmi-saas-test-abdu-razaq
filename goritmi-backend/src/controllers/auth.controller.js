import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateToken from "../utills/generateToken.js";
import generateOtp from "../utills/generateOtp.js";
import sendEmail from "../utills/sendEmail.js";

// ===============================
// 📌 REGISTER USER
// ===============================
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //  Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All field are required" });
    }

    //  Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    //  Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    //  Generate OTP
    const otp = generateOtp(); // 6-digit string

    //  Hash OTP
    const emailOtpHash = await bcrypt.hash(otp, 10);

    //  Create user
    const user = await User.create({
      name,
      email,
      passwordHash,
      emailOtpHash,
      emailOtpExpiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    //  Send OTP email
    await sendEmail({
      to: email,
      subject: "Goritmi Verification Code",
      html: ` <div style="font-family: Arial, sans-serif">
        <h2>Verify your email</h2>
        <p>Your OTP code is:</p>
        <h1>${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
      </div>`,
    });

    // cookie options to store email
    const Options = {
      httpOnly: true,
      maxAge: 5 * 60 * 1000, // 5 minutes
      sameSite: "lax",
    };

    // set cookie to store email
    res.cookie("email", email, Options);

    //  Return response as success
    return res.status(201).json({
      message: "Registration successful. OTP sent to email.",
      user: { email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "server error" });
  }
};
// ===============================
// 📌 VERIFY EMAIL
// ===============================
const verifyEmail = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.cookies.email;

    // Validate input
    if (!otp) {
      return res.status(400).json({ message: "otp required" });
    }

    if (!email) {
      return res.status(404).json({ message: "email not found on cookie" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check Otp existence
    if (!user.emailOtpHash) {
      return res.status(404).json({ message: "Otp not found" });
    }

    // Otp expiry check
    if (user.emailOtpExpiresAt < Date.now()) {
      return res
        .status(400)
        .json({ message: "Otp expired! Please resend Otp." });
    }

    //  Max attempts check (5)
    if (user.emailOtpAttempts >= 5) {
      return res.status(429).json({
        message: "Maximum OTP attempts exceeded. Please resend OTP.",
      });
    }

    //Compare OTP (bcrypt)
    const isOtpValid = await bcrypt.compare(otp, user.emailOtpHash);

    if (!isOtpValid) {
      user.emailOtpAttempts += 1;
      await user.save();

      return res.status(400).json({ message: "Invalid Otp" });
    }

    // Otp success Email verify true & save
    user.isVerified = true;
    user.emailOtpHash = null;
    user.emailOtpExpiresAt = null;
    user.emailOtpAttempts = 0;
    await user.save();

    //  Issue JWT
    const token = generateToken(user._id, user.role);

    // 🔐 HTTP-only cookie
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .clearCookie("email", email, {
        httpOnly: true,
        maxAge: 5 * 60 * 1000, // 5 minutes
        sameSite: "lax",
      });

    // Return res as success & set cookie
    return res.status(200).json({
      message: "Email Verified",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// ===============================
// 📌 RESEND OTP
// ===============================
const resendEmailOtp = async (req, res) => {
  try {
    const email = req.cookies.email;

    // Validate input
    if (!email) {
      return res.status(400).json({ message: "Email is not found on cookie" });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Already verified
    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Generate new Otp
    const otp = generateOtp();
    const emailOtpHash = await bcrypt.hash(otp, 10);

    // Overwrite old OTP (invalidate previous one)
    user.emailOtpHash = emailOtpHash;
    user.emailOtpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 mint
    user.emailOtpAttempts = 0;
    await user.save();

    //Send email
    await sendEmail({
      to: email,
      subject: "Goritmi Verification Code (Resent)",
      html: `
        <div style="font-family: Arial, sans-serif">
          <h2>OTP Resent</h2>
          <p>Your new verification code is:</p>
          <h1>${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `,
    });

    return res
      .status(200)
      .json({ message: "OTP resent successfully. Please check your email." });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// 📌 LOGIN USER
// ===============================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "All field are required" });
    }

    // Find user
    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // check is Password valid
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    // Email not verified → send OTP & block login
    if (!user.isVerified) {
      const otp = generateOtp();
      const emailOtpHash = await bcrypt.hash(otp, 10);

      user.emailOtpHash = emailOtpHash;
      user.emailOtpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 min
      user.emailOtpAttempts = 0;
      await user.save();

      // send email
      await sendEmail({
        to: email,
        subject: "Goritmi Login Verification Code",
        html: `
          <div style="font-family: Arial, sans-serif">
            <h2>Login Verification</h2>
            <p>Your OTP code is:</p>
            <h1>${otp}</h1>
            <p>This code will expire in 10 minutes.</p>
          </div>
        `,
      });

      return res.status(403).json({
        message: "Email not verified. OTP sent to email.",
        requiresOtp: true,
        email,
      });
    }

    // Email verified → issue JWT
    const token = generateToken(user._id, user.role);

    // 🔐 HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // res successfully
    return res.status(200).json({
      message: "Login successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
// 📌 UPDATE PASSWORD
// ===============================
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Validate field
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "all field are required" });
    }

    // check user on cookie
    if (!req.user) {
      return res.status(401).json({ message: "unauthorized request" });
    }

    // Find user
    const user = await User.findById(req.user._id).select("+passwordHash");

    // Compare oldPassword with new Password
    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);

    if (!isMatch) {
      return res.status(400).json({ message: "incorrect old password" });
    }

    // Hashing new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Updating password
    user.passwordHash = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// ===============================
// 📌 FORGOT PASSWORD
// ===============================
// ===============================
// 📌 SEND OTP
// ===============================
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    // find email on db
    const user = await User.findOne({ email });
    // check email is available
    if (!user) {
      return res.status(404).json("email not found");
    }
    // generate otp
    const otp = generateOtp();
    user.emailOtpHash = otp;
    await user.save();

    //  Send OTP email
    await sendEmail({
      to: email,
      subject: "Goritmi Verification Code",
      html: ` <div style="font-family: Arial, sans-serif">
        <h2>Verify your email</h2>
        <p>Your OTP code is:</p>
        <h1>${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
      </div>`,
    });

    // cookie options to store email
    const Options = {
      httpOnly: true,
      maxAge: 5 * 60 * 1000, // 5 minutes
      sameSite: "lax",
    };

    // set cookie to store email
    res.cookie("email", email, Options);

    return res
      .status(200)
      .json({ message: "otp send successfully", id: user._id });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};
// ===============================
// 📌 VERIFY OTP
// ===============================
const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.cookies.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    // Check Otp existence
    if (!user.emailOtpHash) {
      return res.status(404).json({ message: "Otp not found" });
    }

    // Otp expiry check
    if (user.emailOtpExpiresAt < Date.now()) {
      return res
        .status(400)
        .json({ message: "Otp expired! Please resend Otp." });
    }

    //  Max attempts check (5)
    if (user.emailOtpAttempts >= 5) {
      return res.status(429).json({
        message: "Maximum OTP attempts exceeded. Please resend OTP.",
      });
    }

    //Compare OTP (bcrypt)
    const isOtpValid = await bcrypt.compare(otp, user.emailOtpHash);

    if (!isOtpValid) {
      user.emailOtpAttempts += 1;
      await user.save();

      return res.status(400).json({ message: "Invalid Otp" });
    }

    // Otp success Email verify true & save
    user.forgotVerifyOtp = true;
    user.emailOtpHash = null;
    user.emailOtpExpiresAt = null;
    user.emailOtpAttempts = 0;
    await user.save();

    return res.status(200).json({
      message: "Email Verified",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// ===============================
// 📌 CHANGE PASSWORD
// ===============================
const changePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const email = req.cookies.email;

    // Find user
    const user = await User.findOne(email);

    if (!user) {
      return res.status(404).json({ message: "invalid id" });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!user.forgotVerifyOtp) {
      return res.status(401).json({ message: "otp not verified" });
    }

    // forgotVerifyOtp = false and save new password
    user.forgotVerifyOtp = false;
    user.password = hashedPassword;
    await user.save();

    // clear email from cookie
    res.clearCookie("email", email, {
      httpOnly: true,
      maxAge: 5 * 60 * 1000, // 5 minutes
      sameSite: "lax",
    });

    return res.status(200).json({ message: "password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "server error", error });
  }
};
// ===============================
// 📌 FORGOT PASSWORD END
// ===============================

export {
  register,
  verifyEmail,
  resendEmailOtp,
  login,
  logout,
  updatePassword,
  sendOTP, //send otp forgot password
  verifyOTP, //verify otp forgot password
  changePassword, //change password forgot password
};
