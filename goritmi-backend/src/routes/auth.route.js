import { Router } from "express";
const router = Router();
import resendOtpLimiter from "../middlewares/rateLimit.middleware.js";
// ===============================
// 📌 IMPORT CONTROLLERS
// ===============================
import {
  register,
  login,
  verifyEmail,
  logout,
  updatePassword,
  sendOTP,
  verifyOTP,
  changePassword,
  resendEmailOtp,
  reSendOTP,
} from "../controllers/auth.controller.js";
// ===============================
// 📌 IMPORT MIDDLEWARE
// ===============================
import verifyUser from "../middlewares/auth.middleware.js";
import validateMiddleware from "../middlewares/validate.middleware.js";
// ===============================
// 📌 IMPORT VALIDATOR SCHEMAS
// ===============================
import {
  registerSchema,
  logInSchema,
  passwordUpdateSchema,
} from "../utills/auth.validdator.js";
// ===============================
// 📌 ROUTES
// ===============================
router.route("/register").post(validateMiddleware(registerSchema), register);
router.route("/login").post(validateMiddleware(logInSchema), login);
router.route("/otp/verify").post(verifyEmail);
router.route("/otp/resend").post(resendOtpLimiter, resendEmailOtp);
//==============================================
// verify user routes
//==============================================
router.route("/logout").post(verifyUser, logout);
router
  .route("/update-password")
  .patch(validateMiddleware(passwordUpdateSchema), verifyUser, updatePassword);

// ==================================================
// FORGOT PASSWORD
// ==================================================
router.route("/forgot-password").post(resendOtpLimiter, sendOTP);
router.route("/resend/forgot/otp").post(resendOtpLimiter, reSendOTP);
router.route("/verify-otp").post(verifyOTP);
router.route("/change-password").post(changePassword);

export default router;
