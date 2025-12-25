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

      const expireIt = res?.data?.user?.expireIt;

      if (expireIt) {
        // Save expiry in localStorage
        localStorage.setItem("expireIt", expireIt);
      }

      // Save user data in state/context
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
      localStorage.removeItem("expireIt");
      setUser(res.data.user);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.message);
      setErr(error.response?.data?.message);
      throw new Error(error.response?.data?.message || "verification failed");
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

      const user = res.data.user;

      // Save OTP expiry in localStorage
      if (user?.expireIt) {
        localStorage.setItem("expireIt", user.expireIt);
      }

      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed");
      setErr(error.response?.data?.message || "Failed");
      throw new Error(error.response?.data?.message || "Failed");
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
      localStorage.removeItem("expireIt");
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.message);
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

      // IF EMAIL NOT VERIFIED
      if (data.requiresOtp) {
        const user = data.user;

        // Save OTP expiry in localStorage
        if (user?.expireIt) {
          localStorage.setItem("expireIt", user.expireIt);
        }
      }

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
