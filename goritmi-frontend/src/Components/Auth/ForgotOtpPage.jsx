import React from "react";
import OTPVerify from "./OTPVerify";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ForgotOtpPage = () => {
  const nav = useNavigate();
  const { verifyOtp } = useAuth();

  const handleSubmit = async (otp) => {
    //Call API
    await verifyOtp(otp);
    // success → redirect
    nav("/change/password");
  };
  return (
    <div>
      <OTPVerify onSubmit={handleSubmit} />
    </div>
  );
};

export default ForgotOtpPage;
