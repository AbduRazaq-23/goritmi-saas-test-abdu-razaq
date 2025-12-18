import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const OTPVerify = ({ onSubmit }) => {
  const { err, resendOtp } = useAuth();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return; // only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // take only the last character (prevents pasting multiple)
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputRefs.current[index - 1].focus();
      } else if (otp[index] !== "") {
        // Clear current box on backspace if it has value
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  // Auto-submit when all 6 digits are filled
  useEffect(() => {
    (async () => {
      try {
        const isComplete = otp.every(
          (digit) => digit !== "" && /^\d$/.test(digit)
        );
        if (isComplete) {
          await onSubmit(otp); // auto submit
        }
      } catch (error) {
        console.log(error);
        setOtp(["", "", "", "", "", ""]); // clear on failure
        inputRefs.current[0]?.focus();
      }
    })();
  }, [otp]); // runs every time otp changes

  const resendOtpSubmit = async () => {
    await resendOtp();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Verify OTP
        </h2>
        <p className="text-gray-600 text-center mb-6 text-sm">
          Enter the 6-digit code sent to your email.
        </p>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* OTP Boxes */}
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`"w-12 h-12 md:w-14 md:h-14 text-center text-xl font-bold 
                bg-white/20 text-gray-900 border ${
                  err ? "border-red-400" : "border-gray-400"
                } rounded-lg 
                backdrop-blur-sm focus:ring-2 focus:ring-blue-300 outline-none"`}
              />
            ))}
          </div>
        </form>

        {/* Resend OTP */}
        <div className="text-center text-gray-600 mt-6 text-sm">
          Didn’t receive the code?{" "}
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
