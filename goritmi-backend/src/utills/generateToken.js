import jwt from "jsonwebtoken";

// ===============================
// 📌 TO GENERATE TOKEN
// ===============================
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};
export default generateToken;
