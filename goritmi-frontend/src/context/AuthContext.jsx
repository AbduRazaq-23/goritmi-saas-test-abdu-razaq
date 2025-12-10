import { useState, useContext, createContext, useEffect } from "react";
import axios from "axios";

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
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Register failed");
    }
  };
  //========================
  // VERIFY EMAIL API CALL
  //========================
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
  //========================
  // GET PROFILE API CALL
  //========================
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
