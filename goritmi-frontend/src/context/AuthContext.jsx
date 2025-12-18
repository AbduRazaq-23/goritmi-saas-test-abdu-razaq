import { useState, useContext, createContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  //========================
  // REGISTER API CALL
  //========================
  const register = async (form) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );
      setUser(res.data.user);
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Register failed");
    }
  };

  //========================
  // VERIFY EMAIL API CALL
  //========================
  const verifyEmail = async (otp) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/otp/verify",
        { otp },
        {
          withCredentials: true,
        }
      );
      setUser(res.data.user);
      toast.success(res.data.message);
    } catch (error) {
      setErr(error.response?.data?.message);
      throw new Error(error.response?.data?.message || "verification failed");
    }
  };

  //========================
  // RESEND OTP API CALL
  //========================
  const resendOtp = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/otp/resend",
        {}
      );
      setUser(res.data.user);
      toast.success(res.data.message);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  //====================================================
  // FORGOT PASSWORD START
  //====================================================

  //========================
  // SEND OTP
  //========================
  const sendOtp = async (email) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );
      toast.success(res.data.message);
    } catch (error) {
      setErr(error.response?.data?.message);
      throw new Error(error.response?.data?.message || "failed");
    }
  };
  //========================
  // VERIFY OTP
  //========================
  const verifyOtp = async (otp) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { otp }
      );
      toast.success(res.data.message);
    } catch (error) {
      setErr(error.response?.data?.message);
      throw new Error(error.response?.data?.message || "verify otp failled");
    }
  };
  //========================
  // CHANGE PASSWORD
  //========================
  const changePassword = async (password) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/change-password",
        {
          password,
        }
      );
      toast.success(res.data.message);
    } catch (error) {
      setErr(error.response?.data?.message);
      throw new Error(
        error.response?.data?.message || "change password failed"
      );
    }
  };

  //====================================================
  // FORGOT PASSWORD END
  //====================================================

  //========================
  // GET PROFILE API CALL
  //========================
  const getProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/user/get-profile",
        { withCredentials: true }
      );
      setUser(res.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  //========================
  // TO CALL GET PROFILE
  //========================
  useEffect(() => {
    getProfile();
  }, []);

  //========================
  // LOGIN API CALL
  //========================
  const login = async (form) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        form,
        {
          withCredentials: true,
        }
      );
      setUser((prev) => ({ ...prev, ...data.user }));
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  //========================
  // LOGOUT API CALL
  //========================
  const logout = async () => {
    const res = await axios.post("http://localhost:5000/api/auth/logout", {
      withCredentials: true,
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        err,
        register,
        verifyEmail,
        resendOtp,
        sendOtp,
        verifyOtp,
        changePassword,
        login,
        logout,
        getProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
