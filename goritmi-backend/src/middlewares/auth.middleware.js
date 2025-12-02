import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
// ===============================
// 📌 AUTH MIDDLEWARE
// ===============================
const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split("")[1];
    if (!token) {
      return res.status(401).json({ message: "unauthorized request" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken.id);
    // console.log(user);

    if (!user) {
      return res.status(401).json({ message: "invalid token to find user" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "invalid token" });
  }
};
export default verifyUser;
