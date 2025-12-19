import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const nav = useNavigate();
  const { login, sendOtp } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  // handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      toast.success(res.message, { position: "top-right", autoClose: 1000 });

      if (res.requiresOtp) {
        nav("/verify-email");
        return;
      }
      nav("/dashboard");
    } catch (error) {
      toast.error(error.message, { position: "top-right", autoClose: 1000 });
    }
  };
  // handle forgot password
  const handleForgotPassword = async () => {
    await sendOtp(form.email);
    nav("/forgot-password/verify");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {/* Forgot password */}
            <p
              onClick={handleForgotPassword}
              className="text-sm font-medium text-gray-700 text-right hover:text-blue-600 cursor-pointer"
            >
              Forgot password
            </p>
          </div>

          {/* Login button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            Login
          </motion.button>

          {/* Switch link */}
          <p className="text-center text-gray-600 text-sm">
            Don't have an account?
            <Link to="/register" className="text-blue-600 ml-1 font-medium">
              Register
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
