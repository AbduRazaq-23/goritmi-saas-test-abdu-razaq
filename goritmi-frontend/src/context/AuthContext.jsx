import { useState, useContext, createContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState();

  const register = async (form) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Register failed");
    }
  };
  const verifyOtp = async (otp) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verfiy-email",
        { otp: otp }
      );
      return res.data;
    } catch (error) {
      setErr(error.response?.data?.message);
      throw new Error(error.response?.data?.message || "veerification failed");
    }
  };

  const getProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/auth/get-profile",
        { withCredentials: true }
      );

      setUser(res.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getProfile();
  }, []);

  const login = async (form) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        form,
        {
          withCredentials: true,
        }
      );
      getProfile();
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

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
        loading,
        err,
        register,
        verifyOtp,
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
