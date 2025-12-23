import React from "react";
import LandingPage from "./Pages/LandingPage";
import { Route, Routes } from "react-router-dom";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import Dashboard from "./Pages/Dashboard";
import { ProtectedRoute } from "./Routes/ProtectedRoutes";

import SignupOtpPage from "./Components/Auth/SignupOtpPage";
import ForgotOtpPage from "./Components/Auth/ForgotOtpPage";
import ChangePassword from "./Components/Auth/ChangePassword";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<SignupOtpPage />} />
        <Route path="/forgot-password/verify" element={<ForgotOtpPage />} />
        <Route path="/change/password" element={<ChangePassword />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
