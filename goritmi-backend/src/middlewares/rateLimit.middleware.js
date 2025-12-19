import rateLimit from "express-rate-limit";

const resendOtpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, //5 mint
  max: 3,
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Too many OTP requests. Please try again after 5 minutes.",
    });
  },
});

export default resendOtpLimiter;
