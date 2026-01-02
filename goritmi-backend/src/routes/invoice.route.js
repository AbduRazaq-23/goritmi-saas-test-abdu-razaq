import Router from "express";
const invoiceRoute = Router();

// Import admin invoice controllers
import {
  bulkDeleteInvoices,
  createInvoice,
  getAdminInvoices,
  getInvoiceById,
  getInvoiceSummary,
  updateInvoice,
  updateInvoiceStatus,
} from "../controllers/invoice.controller.js";

// Verify Admin middleware
import adminOnly from "../middlewares/isAdmin.middleware.js";

// Verify User middleware
import verifyUser from "../middlewares/auth.middleware.js";

// Create Invoices only admin
invoiceRoute.route("/invoices").post(verifyUser, adminOnly, createInvoice);

// Update Invoices only admin
invoiceRoute
  .route("/invoices/update/:id")
  .patch(verifyUser, adminOnly, updateInvoice);

// Update Invoice status only admin
invoiceRoute
  .route("/invoices/:id/status")
  .patch(verifyUser, adminOnly, updateInvoiceStatus);

// Get Invoices only admin
invoiceRoute.route("/invoices").get(verifyUser, adminOnly, getAdminInvoices);

// Get Invoices summary only admin
invoiceRoute
  .route("/invoices/summary")
  .get(verifyUser, adminOnly, getInvoiceSummary);

// Get Invoices by id only admin
invoiceRoute.route("/invoice/:id").get(verifyUser, adminOnly, getInvoiceById);

// Delete Invoices Bulk by id's only admin
invoiceRoute
  .route("/invoices/bulk-delete")
  .delete(verifyUser, adminOnly, bulkDeleteInvoices);

// Export Inovice Route
export default invoiceRoute;
