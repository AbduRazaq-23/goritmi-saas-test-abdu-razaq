import React from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./Pages/LandingPage";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import Dashboard from "./Pages/Dashboard";
import { ProtectedRoute } from "./Routes/ProtectedRoutes";

import SignupOtpPage from "./Components/Auth/SignupOtpPage";
import ForgotOtpPage from "./Components/Auth/ForgotOtpPage";
import ChangePassword from "./Components/Auth/ChangePassword";

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<SignupOtpPage />} />
      <Route path="/forgot-password/verify" element={<ForgotOtpPage />} />
      <Route path="/change/password" element={<ChangePassword />} />

      {/* PROTECTED DASHBOARD */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* FALLBACK */}
      <Route
        path="*"
        element={
          <h1 className="w-full min-h-screen flex justify-center items-center ">
            404 - Page Not Found
          </h1>
        }
      />
    </Routes>
  );
}

export default App;
