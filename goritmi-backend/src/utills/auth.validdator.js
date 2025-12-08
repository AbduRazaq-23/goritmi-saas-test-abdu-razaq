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
// 📌 BY NAME EXPORT
// ===============================
export { registerSchema, logInSchema, updateSchema, passwordUpdateSchema };
