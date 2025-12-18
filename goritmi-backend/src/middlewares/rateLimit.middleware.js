import rateLimit from "express-rate-limit";

const resendOtpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, //5 mint
  max: 3,
  message: "Too many OTP requests. Please try again later.",
});

export default resendOtpLimiter;
