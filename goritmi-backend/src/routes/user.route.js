import { Router } from "express";
const userRoute = Router();

import adminOnly from "../middlewares/isAdmin.middleware.js";
import verifyUser from "../middlewares/auth.middleware.js";

// ===============================
// 📌 IMPORT USER CONTROLLER
// ===============================
import {
  getProfile,
  updateProfile,
  getAllUser,
  deleteUser,
  toggleStatusUser,
  uploadLogo,
} from "../controllers/user.controller.js";

// ===============================
// 📌 IMPORT MULTER MIDDLEWARE
// ===============================
import { upload } from "../middlewares/multer.middleware.js";

//===========
// ROUTES
//===========

//  TOGGLE USER STATUS TO ACTIVATE OR DEACTIVATE
userRoute
  .route("/toggle-status/:id")
  .patch(verifyUser, adminOnly, toggleStatusUser);

// GET ALL USERS ONLY ADMIN
userRoute.route("/get-all-users").get(verifyUser, adminOnly, getAllUser);

// DELETE USER BY ID ONLY ADMIN
userRoute.route("/delete-user/:id").delete(verifyUser, adminOnly, deleteUser);

// UPDATE PROFILE DETAILS
userRoute.route("/update-profile").patch(verifyUser, updateProfile);

// GET PROFILE
userRoute.route("/get-profile").get(verifyUser, getProfile);

// USER LOGO UPLOAD
userRoute
  .route("/upload/logo")
  .post(verifyUser, upload.single("logo"), uploadLogo);

export default userRoute;
