import { Router } from "express";
const userInvoiceRoute = Router();
import verifyUser from "../middlewares/auth.middleware.js";
import {
  getMyInvoices,
  getMyInvoiceById,
} from "../controllers/userInvoices.controller.js";

userInvoiceRoute.route("/").get(verifyUser, getMyInvoices);
userInvoiceRoute.route("/:id").get(verifyUser, getMyInvoiceById);

export default userInvoiceRoute;
