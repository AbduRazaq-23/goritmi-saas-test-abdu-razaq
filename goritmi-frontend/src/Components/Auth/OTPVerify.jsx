import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const OTP_LENGTH = 6;

const OTPVerify = ({ onSubmit }) => {
  const { err, resendOtp } = useAuth();
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef([]);
  const [secondsLeft, setSecondsLeft] = useState(0);

  /* ------------------ HANDLE OTP CHANGE ------------------ */
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /* ------------------ HANDLE BACKSPACE ------------------ */
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  /* ------------------ HANDLE PASTE ------------------ */
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    const newOtp = [...otp];
    pasted.split("").forEach((digit, i) => {
      newOtp[i] = digit;
    });

    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length - 1, OTP_LENGTH - 1)]?.focus();
  };

  /* ------------------ AUTO SUBMIT ------------------ */
  useEffect(() => {
    const isComplete = otp.every((d) => /^\d$/.test(d));
    if (isComplete) {
      onSubmit(otp.join(""));
    }
  }, [otp]);

  /* ------------------ TIMER ------------------ */
  useEffect(() => {
    // get expiry from localStorage or context
    let expiryISO = localStorage.getItem("expireIt");
    if (!expiryISO) return;

    const expiryTime = new Date(expiryISO).getTime();

    const interval = setInterval(() => {
      const diff = Math.max(Math.floor((expiryTime - Date.now()) / 1000), 0);
      setSecondsLeft(diff);

      if (diff === 0) {
        clearInterval(interval);
        localStorage.removeItem("expireIt");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* ------------------ RESEND OTP ------------------ */
  const resendOtpSubmit = async () => {
    setOtp(Array(OTP_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
    const res = await resendOtp(); // backend returns new otpExpiresAt
    const newExpiry = res.otpExpiresAt;
    setOtpExpiresAt(newExpiry);
    localStorage.setItem("otpExpiresAt", newExpiry);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-3xl font-bold text-center mb-4">Verify OTP</h2>
        <p className="text-gray-600 text-center mb-6 text-sm">
          Enter the 6-digit code sent to your email
        </p>

        {/* OTP INPUTS */}
        <div className="flex justify-between gap-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className={`w-12 h-12 md:w-14 md:h-14 text-center text-xl font-bold
                border rounded-lg outline-none
                ${err ? "border-red-400" : "border-gray-400"}
                focus:ring-2 focus:ring-blue-300`}
            />
          ))}
        </div>

        {/* TIMER + RESEND */}
        <div className="flex justify-between items-center text-sm mb-4">
          {secondsLeft > 0 ? (
            <p className="text-gray-600">
              Expires in{" "}
              <span className="font-semibold">
                {minutes}:{seconds.toString().padStart(2, "0")}
              </span>
            </p>
          ) : (
            <p className="text-red-500 font-semibold">OTP expired</p>
          )}

          <button
            onClick={resendOtpSubmit}
            className="text-blue-600 underline hover:text-blue-700"
          >
            Resend OTP
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OTPVerify;
