import React from "react";
import OTPVerify from "./OTPVerify";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignupOtpPage = () => {
  const nav = useNavigate();
  const { verifyEmail } = useAuth();

  const handleSubmit = async (otp) => {
    //Call API
    await verifyEmail(otp);
    // success → redirect
    nav("/dashboard");
  };

  // RESEND OTP API CALL
  const resendOtp = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/otp/resend",
        {}
      );
      const user = res?.data?.user;
      // Save new OTP expiry in localStorage
      if (user?.expireIt) {
        localStorage.setItem("expireIt", user.expireIt);
      }
      toast.success(res.data.message);
      return user;
    } catch (error) {
      toast.error(error.response?.data?.message || "Too many requests");
    }
  };

  return (
    <div>
      <OTPVerify onSubmit={handleSubmit} onResend={resendOtp} />
    </div>
  );
};

export default SignupOtpPage;
