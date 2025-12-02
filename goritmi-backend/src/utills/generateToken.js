import jwt from "jsonwebtoken";

// ===============================
// 📌 TO GENERATE TOKEN
// ===============================
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};
export default generateToken;
