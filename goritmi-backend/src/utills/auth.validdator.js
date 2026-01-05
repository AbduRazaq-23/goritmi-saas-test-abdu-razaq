import joi from "joi";

// ===============================
// 📌 REGISTER VALIDATOR SCHEMA
// ===============================
const registerSchema = joi.object({
  name: joi.string().min(3).max(20).required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
});
// ===============================
// 📌 LOGIN VALIDATOR SCHEMA
// ===============================
const logInSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
});
// ===============================
// 📌 UPDATE VALIDATOR SCHEMA
// ===============================
const updateSchema = joi.object({
  name: joi.string().min(3).max(20).optional(),
  email: joi.string().email().optional(),
});
// 📌 UPDATE VALIDATOR SCHEMA
// ===============================
const passwordUpdateSchema = joi.object({
  oldPassword: joi.string().min(8).required(),
  newPassword: joi.string().min(8).required(),
});
// ===============================
// 📌 CREATE INVOICE
// ===============================
const invoiceSchema = joi.object({
  userId: joi.string().required().messages({
    "any.required": "User ID is required",
    "string.empty": "User ID cannot be empty",
  }),
  items: joi.array().min(1).required().messages({
    "array.base": "Items must be an array",
    "array.min": "At least one item is required",
    "any.required": "Invoice items are required",
  }),
  tax: joi.number().optional().messages({
    "number.base": "Tax must be a number",
  }),
  discount: joi.number().optional().messages({
    "number.base": "Discount must be a number",
  }),
  dueDate: joi.date().required().messages({
    "date.base": "Due date must be a valid date",
    "any.required": "Due date is required",
  }),
  notes: joi.string().required().messages({
    "string.empty": "Notes cannot be empty",
    "any.required": "Notes are required",
  }),
});
// ===============================
// 📌 UPDATE INVOICE
// ===============================
const UpdateInvoiceSchema = joi.object({
  items: joi.array().min(1).required().messages({
    "array.base": "Items must be an array",
    "array.min": "At least one item is required",
    "any.required": "Invoice items are required",
  }),
  tax: joi.number().optional().messages({
    "number.base": "Tax must be a number",
  }),
  discount: joi.number().optional().messages({
    "number.base": "Discount must be a number",
  }),
  dueDate: joi.date().required().messages({
    "date.base": "Due date must be a valid date",
    "any.required": "Due date is required",
  }),
  notes: joi.string().required().messages({
    "string.empty": "Notes cannot be empty",
    "any.required": "Notes are required",
  }),
});
// ===============================
// 📌 BY NAME EXPORT
// ===============================
export {
  registerSchema,
  logInSchema,
  updateSchema,
  passwordUpdateSchema,
  invoiceSchema,
  UpdateInvoiceSchema,
};
