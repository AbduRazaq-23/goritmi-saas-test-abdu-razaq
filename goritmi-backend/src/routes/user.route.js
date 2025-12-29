import { Router } from "express";
const userRoute = Router();

import adminOnly from "../middlewares/isAdmin.middleware.js";
import verifyUser from "../middlewares/auth.middleware.js";
import validateMiddleware from "../middlewares/validate.middleware.js";

// ===============================
// 📌 IMPORT USER CONTROLLER
// ===============================
import {
  getProfile,
  updateProfile,
  getAllUser,
  deleteUser,
  toggleStatusUser,
} from "../controllers/user.controller.js";

// ===============================
// 📌 IMPORT VALIDATOR SCHEMAS
// ===============================
import { updateSchema } from "../utills/auth.validdator.js";

//===========
// ROUTES
//===========
userRoute
  .route("/toggle-status/:id")
  .patch(verifyUser, adminOnly, toggleStatusUser);

userRoute.route("/get-all-users").get(verifyUser, adminOnly, getAllUser);

userRoute.route("/delete-user/:id").delete(verifyUser, adminOnly, deleteUser);

userRoute.route("/update-profile").patch(verifyUser, updateProfile);

userRoute.route("/get-profile").get(verifyUser, getProfile);

export default userRoute;
