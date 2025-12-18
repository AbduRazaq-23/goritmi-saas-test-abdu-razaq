import React from "react";
import OTPVerify from "./OTPVerify";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ForgotOtpPage = () => {
  const { verifyOtp } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (otp) => {
    const newOtp = otp.join("");
    await verifyOtp(newOtp);
    nav("/reset-password");
  };
  return (
    <div>
      <OTPVerify onSubmit={handleSubmit} />
    </div>
  );
};

export default ForgotOtpPage;
