import { Router } from "express";
const router = Router();
// ===============================
// 📌 IMPORT CONTROLLERS
// ===============================
import {
  register,
  login,
  getProfile,
  logout,
  updateProfile,
  updatePassword,
  getAllUser,
  deleteUser,
} from "../controllers/auth.controller.js";
// ===============================
// 📌 IMPORT MIDDLEWARE
// ===============================
import verifyUser from "../middlewares/auth.middleware.js";
import adminOnly from "../middlewares/isAdmin.middleware.js";
import validateMiddleware from "../middlewares/validate.middleware.js";
// ===============================
// 📌 IMPORT VALIDATOR SCHEMAS
// ===============================
import {
  registerSchema,
  logInSchema,
  updateSchema,
} from "../utills/auth.validdator.js";
// ===============================
// 📌 ROUTES
// ===============================
router.route("/register").post(validateMiddleware(registerSchema), register);
router.route("/login").post(validateMiddleware(logInSchema), login);
router.route("/get-profile").get(verifyUser, getProfile);
router.route("/logout").post(verifyUser, logout);
router
  .route("/update-profile")
  .patch(validateMiddleware(updateSchema), verifyUser, updateProfile);
router
  .route("/update-password")
  .patch(validateMiddleware(updateSchema), verifyUser, updatePassword);
router.route("/get-all-users").get(verifyUser, adminOnly, getAllUser);
router.route("/delete-user/:id").delete(verifyUser, adminOnly, deleteUser);

export default router;
