import Router from "express";
const invoiceRoute = Router();

import {
  createInvoice,
  getAdminInvoices,
  getInvoiceById,
  getInvoiceSummary,
  updateInvoice,
  updateInvoiceStatus,
} from "../controllers/invoice.controller.js";
import adminOnly from "../middlewares/isAdmin.middleware.js";
import verifyUser from "../middlewares/auth.middleware.js";

invoiceRoute.route("/invoices").post(verifyUser, adminOnly, createInvoice);
invoiceRoute
  .route("/invoices/update/:id")
  .patch(verifyUser, adminOnly, updateInvoice);
invoiceRoute
  .route("/invoices/:id/status")
  .patch(verifyUser, adminOnly, updateInvoiceStatus);
invoiceRoute.route("/invoices").get(verifyUser, adminOnly, getAdminInvoices);
invoiceRoute
  .route("/invoices/summary")
  .get(verifyUser, adminOnly, getInvoiceSummary);
invoiceRoute.route("/invoice/:id").get(verifyUser, adminOnly, getInvoiceById);

export default invoiceRoute;
