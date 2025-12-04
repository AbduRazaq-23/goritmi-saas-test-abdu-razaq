import { useState, useContext, createContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const register = async (form) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );
      setUser(res.data.user);
      return { success: true };
    } catch (error) {
      return error.res?.data?.message;
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
    const res = await axios.post("http://localhost:5000/api/auth/login", form, {
      withCredentials: true,
    });

    getProfile();

    setUser(res.data);
    return res.data;
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
        register,
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
