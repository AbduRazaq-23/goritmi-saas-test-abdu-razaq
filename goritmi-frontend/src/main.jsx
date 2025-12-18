import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import axios from "../src/axiosConfig";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ScrollToHashElement() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // If no hash, scroll to top (optional)
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [hash]);

  return null;
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ScrollToHashElement />
    <AuthProvider>
      <App />
      <ToastContainer />
    </AuthProvider>
  </BrowserRouter>
);
