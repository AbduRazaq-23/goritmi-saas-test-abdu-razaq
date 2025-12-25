import React from "react";
import OTPVerify from "./OTPVerify";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotOtpPage = () => {
  const nav = useNavigate();
  const { verifyOtp } = useAuth();

  const handleSubmit = async (otp) => {
    //Call API
    await verifyOtp(otp);
    // success → redirect
    nav("/change/password");
  };

  const resendForgotOtp = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/resend/forgot/otp"
      );
      const user = res?.data?.user;

      // Save new OTP expiry in localStorage
      if (user?.expireIt) {
        localStorage.setItem("expireIt", user.expireIt);
      }
      toast.success(res.data.message);
      return user;
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <OTPVerify onSubmit={handleSubmit} onResend={resendForgotOtp} />
    </div>
  );
};

export default ForgotOtpPage;
