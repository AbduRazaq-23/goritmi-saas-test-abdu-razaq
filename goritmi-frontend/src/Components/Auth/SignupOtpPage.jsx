import React from "react";
import OTPVerify from "./OTPVerify";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SignupOtpPage = () => {
  const nav = useNavigate();
  const { verifyEmail } = useAuth();

  const handleSubmit = async (otp) => {
    //Call API
    await verifyEmail(otp);
    // success → redirect
    nav("/dashboard");
  };
  return (
    <div>
      <OTPVerify onSubmit={handleSubmit} />
    </div>
  );
};

export default SignupOtpPage;
