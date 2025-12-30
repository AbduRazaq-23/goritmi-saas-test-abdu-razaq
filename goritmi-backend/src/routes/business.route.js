import Router from "express";
const businessRoute = Router();

import {
  createBusinessProfile,
  getBusinessProfile,
  updateBusinessProfile,
  uploadLogo,
} from "../controllers/business.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import verifyUser from "../middlewares/auth.middleware.js";

businessRoute.route("/create").post(verifyUser, createBusinessProfile);
businessRoute.route("/update").patch(verifyUser, updateBusinessProfile);
businessRoute
  .route("/upload/logo")
  .post(verifyUser, upload.single("logo"), uploadLogo);
businessRoute.route("/").get(verifyUser, getBusinessProfile);

export default businessRoute;
